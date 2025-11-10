using Eatzie.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Net.Http.Json;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace Eatzie.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PayOSController : ControllerBase
    {
        private readonly PayOSSettings _config;
        private readonly HttpClient _httpClient;

        public PayOSController(IOptions<PayOSSettings> config)
        {
            _config = config.Value;
            _httpClient = new HttpClient
            {
                BaseAddress = new Uri(_config.BaseUrl ?? "https://api-merchant.payos.vn"),
                Timeout = TimeSpan.FromSeconds(15)
            };
        }

        public sealed class CreatePaymentDto
        {
            public long Amount { get; set; }
        }

        [HttpPost("create-payment")]
        [AllowAnonymous] // Cho phép OrderController gọi nội bộ
        public async Task<IActionResult> CreatePayment([FromBody] CreatePaymentDto dto)
        {
            if (dto.Amount <= 0)
                return BadRequest(new { error = "Số tiền không hợp lệ." });

            var orderCode = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
            var amount = dto.Amount;
            var description = "ORDER"; // <= 9 ký tự cho an toàn

            // Hardcode các URL
            var returnUrl = _config.ReturnUrl ?? "https://pay.payos.vn/web/checkout/success";
            var cancelUrl = _config.CancelUrl ?? "https://pay.payos.vn/web/checkout/cancel";
            var checksum = _config.ChecksumKey!;

            // Build chuỗi ký (sort theo key alphabet)
            var toSign = $"amount={amount}&cancelUrl={cancelUrl}&description={description}&orderCode={orderCode}&returnUrl={returnUrl}";
            var signature = CreateHmacSha256(checksum, toSign);

            var body = new
            {
                orderCode,
                amount,
                description,
                cancelUrl,
                returnUrl,
                signature
            };

            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.TryAddWithoutValidation("x-client-id", _config.ClientId);
            _httpClient.DefaultRequestHeaders.TryAddWithoutValidation("x-api-key", _config.ApiKey);

            HttpResponseMessage res;
            JsonElement json;
            try
            {
                res = await _httpClient.PostAsJsonAsync("/v2/payment-requests", body);
                json = await res.Content.ReadFromJsonAsync<JsonElement>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ PayOS API error: {ex.Message}");
                return StatusCode(502, new { error = "PayOS upstream unavailable/timeout", detail = ex.Message });
            }

            if (!res.IsSuccessStatusCode)
                return StatusCode((int)res.StatusCode, json);

            // Check PayOS response code
            if (json.TryGetProperty("code", out var codeElement))
            {
                var code = codeElement.GetString();
                if (code != "00" && code != null)
                {
                    var desc = json.TryGetProperty("desc", out var descElement) ? descElement.GetString() : "Unknown error";
                    Console.WriteLine($"❌ PayOS API error: Code={code}, Desc={desc}");
                    return StatusCode(400, new { error = $"PayOS Error ({code}): {desc}" });
                }
            }

            var data = json.GetProperty("data");
            var checkoutUrl = data.GetProperty("checkoutUrl").GetString();
            var paymentLinkId = data.TryGetProperty("paymentLinkId", out var paymentLinkIdElement) 
                ? paymentLinkIdElement.GetString() 
                : null;

            Console.WriteLine($"✅ PayOS payment created: orderCode={orderCode}, checkoutUrl={checkoutUrl}");

            return Ok(new
            {
                orderCode,
                amount,
                paymentLinkId,
                checkoutUrl
            });
        }

        // ===== Helper =====
        private static string CreateHmacSha256(string key, string data)
        {
            using var h = new HMACSHA256(Encoding.UTF8.GetBytes(key));
            var hash = h.ComputeHash(Encoding.UTF8.GetBytes(data));
            return BitConverter.ToString(hash).Replace("-", "").ToLowerInvariant();
        }
    }
}

