using Eatzie.Data;
using Eatzie.Helpers;
using Eatzie.Interfaces.IRepository;
using Eatzie.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Linq;
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
        private readonly IPaymentRepository _paymentRepo;
        private readonly IOrderRepository _orderRepo;
        private readonly ApplicationDbContext _dbContext;

        public PayOSController(
            IOptions<PayOSSettings> config,
            IPaymentRepository paymentRepo,
            IOrderRepository orderRepo,
            ApplicationDbContext dbContext)
        {
            _config = config.Value;
            _paymentRepo = paymentRepo;
            _orderRepo = orderRepo;
            _dbContext = dbContext;
            _httpClient = new HttpClient
            {
                BaseAddress = new Uri(_config.BaseUrl ?? "https://api-merchant.payos.vn"),
                Timeout = TimeSpan.FromSeconds(15)
            };
        }

        public sealed class CreatePaymentDto
        {
            public long Amount { get; set; }
            public int OrderId { get; set; }
            public string? Description { get; set; }
        }

        [HttpPost("create-payment")]
        [AllowAnonymous] // Cho phép OrderController gọi nội bộ
        public async Task<IActionResult> CreatePayment([FromBody] CreatePaymentDto dto)
        {
            if (dto.Amount <= 0)
                return BadRequest(new { error = "Số tiền không hợp lệ." });

            if (dto.OrderId <= 0)
                return BadRequest(new { error = "OrderId không hợp lệ." });

            var orderCode = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
            var amount = dto.Amount;
            
            // Lấy thông tin order để tạo description
            var order = await _orderRepo.GetOrderByIdAsync(dto.OrderId);
            var description = dto.Description ?? (order != null 
                ? $"ORDER #{order.Id}" 
                : $"ORDER #{dto.OrderId}");
            
            // Giới hạn description tối đa 250 ký tự (PayOS yêu cầu)
            if (description.Length > 250)
            {
                description = description.Substring(0, 250);
            }

            // Hardcode các URL
            var returnUrl = _config.ReturnUrl ?? "https://pay.payos.vn/web/checkout/success";
            var cancelUrl = _config.CancelUrl ?? "https://pay.payos.vn/web/checkout/cancel";
            // Lưu ý: webhookUrl KHÔNG được gửi trong request body
            // Webhook URL phải được cấu hình riêng trong PayOS dashboard hoặc qua API confirm-webhook
            // https://payos.vn/docs/api/#tag/webhook/operation/confirm-webhook
            var checksum = _config.ChecksumKey!;

            // ===== TẠO CHỮ KÝ (SIGNATURE) =====
            // PayOS yêu cầu tạo signature để kiểm tra thông tin không bị thay đổi
            // Format: amount=$amount&cancelUrl=$cancelUrl&description=$description&orderCode=$orderCode&returnUrl=$returnUrl
            // - Keys được sort theo alphabet: amount, cancelUrl, description, orderCode, returnUrl
            // - Values KHÔNG được encode URI - sử dụng giá trị trực tiếp
            // - Signature = HMAC_SHA256(checksumKey, signatureString)
            // - KHÔNG bao gồm webhookUrl trong signature string!
            // https://payos.vn/docs/api/#tag/payment-request/operation/payment-request
            
            // Build chuỗi ký (sort theo key alphabet) - KHÔNG encode URI
            // Sử dụng giá trị trực tiếp, không encode như code tham khảo từ PayOS
            var signatureString = $"amount={amount}&cancelUrl={cancelUrl}&description={description}&orderCode={orderCode}&returnUrl={returnUrl}";
            
            // Log signature string để debug
            Console.WriteLine($"🔐 Signature string: {signatureString}");
            
            // Tạo signature bằng HMAC_SHA256 với checksum key
            var signature = CreateHmacSha256(checksum, signatureString);
            
            Console.WriteLine($"🔐 Generated signature: {signature}");

            // PayOS API v2 KHÔNG chấp nhận webhookUrl trong request body
            // Webhook URL phải được cấu hình riêng trong PayOS dashboard
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

            // Log PayOS credentials being used (for debugging - remove in production)
            Console.WriteLine($"🔑 PayOS Credentials:");
            Console.WriteLine($"   ClientId: {_config.ClientId}");
            Console.WriteLine($"   ApiKey: {_config.ApiKey.Substring(0, Math.Min(20, _config.ApiKey.Length))}...");
            Console.WriteLine($"   BaseUrl: {_config.BaseUrl}");
            Console.WriteLine($"📦 PayOS Request Body: {JsonSerializer.Serialize(body)}");

            HttpResponseMessage res;
            JsonElement json;
            try
            {
                res = await _httpClient.PostAsJsonAsync("/v2/payment-requests", body);
                var responseContent = await res.Content.ReadAsStringAsync();
                Console.WriteLine($"📥 PayOS Response Status: {res.StatusCode}");
                Console.WriteLine($"📥 PayOS Response Body: {responseContent}");
                json = JsonSerializer.Deserialize<JsonElement>(responseContent);
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
            var checkoutUrlRaw = data.GetProperty("checkoutUrl").GetString();
            
            // Ensure checkoutUrl is a full URL (PayOS might return relative or full URL)
            string checkoutUrl = checkoutUrlRaw ?? "";
            if (!string.IsNullOrEmpty(checkoutUrl) && !checkoutUrl.StartsWith("http://") && !checkoutUrl.StartsWith("https://"))
            {
                // If relative URL, prepend PayOS base URL
                checkoutUrl = $"https://pay.payos.vn{checkoutUrl}";
            }
            
            var paymentLinkId = data.TryGetProperty("paymentLinkId", out var paymentLinkIdElement) 
                ? paymentLinkIdElement.GetString() 
                : null;

            // Lấy QR code từ PayOS response (nếu có)
            var qrCode = data.TryGetProperty("qrCode", out var qrCodeElement) 
                ? qrCodeElement.GetString() 
                : null;

            Console.WriteLine($"✅ PayOS payment created: orderCode={orderCode}");
            Console.WriteLine($"🔗 Raw checkoutUrl from PayOS: {checkoutUrlRaw}");
            Console.WriteLine($"🔗 Final checkoutUrl: {checkoutUrl}");
            Console.WriteLine($"📱 QR Code from PayOS: {(string.IsNullOrEmpty(qrCode) ? "Not provided" : "Provided (base64)")}");

            // Save payment to database
            try
            {
                var payment = new PaymentEntity
                {
                    OrderId = dto.OrderId,
                    PaymentLink = checkoutUrl ?? "",
                    PayOSCode = orderCode.ToString(),
                    Status = "PENDING",
                    Amount = amount,
                    CreatedAt = DateTime.UtcNow
                };

                await _paymentRepo.AddPaymentAsync(payment);
                await _dbContext.SaveChangesAsync();

                Console.WriteLine($"✅ Payment saved to database: PaymentId={payment.Id}, OrderId={dto.OrderId}, PayOSCode={orderCode}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"⚠️ Failed to save payment to database: {ex.Message}");
                // Continue anyway - payment link is still valid
            }

            return Ok(new
            {
                orderCode,
                amount,
                paymentLinkId,
                checkoutUrl,
                qrCode // Trả về QR code nếu có (có thể là null)
            });
        }

        [HttpGet("webhook")]
        [AllowAnonymous]
        public IActionResult WebhookTest()
        {
            // Endpoint để PayOS test kết nối
            return Ok(new { 
                message = "Webhook endpoint is active",
                endpoint = "/api/PayOS/webhook",
                method = "POST"
            });
        }

        /// <summary>
        /// Confirm webhook URL với PayOS
        /// PayOS yêu cầu confirm webhook URL trước khi gửi webhook
        /// </summary>
        [HttpPost("confirm-webhook")]
        [AllowAnonymous]
        public async Task<IActionResult> ConfirmWebhook()
        {
            try
            {
                var webhookUrl = _config.WebhookUrl;
                if (string.IsNullOrEmpty(webhookUrl))
                {
                    return BadRequest(new { error = "WebhookUrl chưa được cấu hình trong appsettings.json" });
                }

                Console.WriteLine($"🔗 Confirming webhook URL với PayOS: {webhookUrl}");

                var body = new
                {
                    webhookUrl = webhookUrl
                };

                _httpClient.DefaultRequestHeaders.Clear();
                _httpClient.DefaultRequestHeaders.TryAddWithoutValidation("x-client-id", _config.ClientId);
                _httpClient.DefaultRequestHeaders.TryAddWithoutValidation("x-api-key", _config.ApiKey);

                HttpResponseMessage res;
                JsonElement json;
                try
                {
                    res = await _httpClient.PostAsJsonAsync("/v2/webhook", body);
                    var responseContent = await res.Content.ReadAsStringAsync();
                    Console.WriteLine($"📥 PayOS Confirm Webhook Response Status: {res.StatusCode}");
                    Console.WriteLine($"📥 PayOS Confirm Webhook Response Body: {responseContent}");
                    json = JsonSerializer.Deserialize<JsonElement>(responseContent);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"❌ PayOS API error: {ex.Message}");
                    return StatusCode(502, new { error = "PayOS upstream unavailable/timeout", detail = ex.Message });
                }

                if (!res.IsSuccessStatusCode)
                {
                    return StatusCode((int)res.StatusCode, json);
                }

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

                Console.WriteLine($"✅ Webhook URL đã được confirm với PayOS: {webhookUrl}");

                return Ok(new
                {
                    success = true,
                    message = "Webhook URL đã được confirm với PayOS",
                    webhookUrl = webhookUrl
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Confirm webhook error: {ex.Message}");
                return StatusCode(500, new { error = "Internal server error", detail = ex.Message });
            }
        }

        [HttpPost("webhook")]
        [AllowAnonymous]
        public async Task<IActionResult> Webhook()
        {
            try
            {
                // Enable buffering để có thể đọc body nhiều lần
                Request.EnableBuffering();
                Request.Body.Position = 0;
                
                // Đọc raw body để verify signature
                using var reader = new StreamReader(Request.Body, Encoding.UTF8, leaveOpen: true);
                var rawBody = await reader.ReadToEndAsync();
                
                // Reset position để có thể đọc lại nếu cần
                Request.Body.Position = 0;
                
                if (string.IsNullOrEmpty(rawBody))
                {
                    Console.WriteLine("❌ Webhook: Empty body");
                    return BadRequest(new { error = "Empty body" });
                }

                Console.WriteLine($"📥 Webhook received: {rawBody}");

                JsonElement json;
                try
                {
                    json = JsonSerializer.Deserialize<JsonElement>(rawBody);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"❌ Webhook: Invalid JSON - {ex.Message}");
                    return BadRequest(new { error = "Invalid JSON" });
                }

                // Verify signature
                if (!json.TryGetProperty("data", out var dataElement) || 
                    !json.TryGetProperty("signature", out var signatureElement))
                {
                    Console.WriteLine("❌ Webhook: Missing data or signature");
                    return BadRequest(new { error = "Missing data or signature" });
                }

                var receivedSignature = signatureElement.GetString();
                var data = dataElement.GetRawText();

                // ===== VERIFY SIGNATURE =====
                // PayOS gửi signature để xác thực dữ liệu webhook
                // Quy trình verify giống như tạo signature:
                // 1. Lấy tất cả properties từ data object
                // 2. Sort keys theo alphabet
                // 3. KHÔNG encode URI - sử dụng giá trị trực tiếp (giống như khi tạo payment)
                // 4. Tạo chuỗi: key=value&key=value...
                // 5. Tạo HMAC-SHA256 với checksum key
                // 6. So sánh với signature nhận được
                
                var dataObj = JsonSerializer.Deserialize<JsonElement>(data);
                var signatureParts = new List<string>();

                // Sort keys alphabetically - KHÔNG encode URI (giống như payment signature)
                foreach (var prop in dataObj.EnumerateObject().OrderBy(p => p.Name))
                {
                    // Lấy giá trị dạng string
                    var value = prop.Value.ValueKind == JsonValueKind.String 
                        ? prop.Value.GetString() ?? ""
                        : prop.Value.GetRawText(); // Cho các kiểu khác (number, boolean, etc.)
                    
                    // KHÔNG encode URI - sử dụng giá trị trực tiếp
                    // PayOS webhook signature sử dụng giá trị trực tiếp, không encode
                    signatureParts.Add($"{prop.Name}={value}");
                }

                var signatureString = string.Join("&", signatureParts);
                Console.WriteLine($"🔐 Webhook signature string: {signatureString}");
                
                // Tạo signature mong đợi bằng HMAC-SHA256
                var expectedSignature = CreateHmacSha256(_config.ChecksumKey!, signatureString);
                Console.WriteLine($"🔐 Expected signature: {expectedSignature}");
                Console.WriteLine($"🔐 Received signature: {receivedSignature}");

                if (receivedSignature != expectedSignature)
                {
                    Console.WriteLine($"❌ Webhook: Invalid signature");
                    Console.WriteLine($"   Received: {receivedSignature}");
                    Console.WriteLine($"   Expected: {expectedSignature}");
                    Console.WriteLine($"   Signature string: {signatureString}");
                    return Unauthorized(new { error = "Invalid signature" });
                }

                Console.WriteLine($"✅ Webhook: Signature verified");

                // Extract data
                var orderCode = dataObj.TryGetProperty("orderCode", out var orderCodeElement) 
                    ? orderCodeElement.GetInt64() 
                    : 0;
                var code = dataObj.TryGetProperty("code", out var codeElement) 
                    ? codeElement.GetString() 
                    : null;

                if (orderCode == 0)
                {
                    Console.WriteLine("❌ Webhook: Missing orderCode");
                    return BadRequest(new { error = "Missing orderCode" });
                }

                // Find payment by PayOSCode
                var payment = await _paymentRepo.GetPaymentByCodeAsync(orderCode.ToString());
                
                if (payment == null)
                {
                    // Payment không tồn tại - có thể là test webhook từ PayOS
                    // PayOS gửi test webhook với orderCode=123 để test webhook endpoint
                    // Trả về 200 OK để PayOS biết webhook endpoint hoạt động
                    Console.WriteLine($"⚠️ Webhook: Payment not found for orderCode={orderCode}");
                    Console.WriteLine($"   Đây có thể là test webhook từ PayOS để xác nhận webhook endpoint");
                    Console.WriteLine($"   Trả về 200 OK để PayOS biết webhook endpoint hoạt động");
                    
                    // Return success response cho test webhook (PayOS expects 200 OK)
                    // PayOS sẽ coi đây là webhook endpoint hoạt động nếu nhận được 200 OK
                    return Ok(new { 
                        code = "00", 
                        desc = "Success",
                        data = new { orderCode },
                        message = "Webhook received but payment not found. This may be a test webhook from PayOS."
                    });
                }

                // Payment tồn tại - xử lý webhook thật
                Console.WriteLine($"✅ Webhook: Payment found for orderCode={orderCode}, OrderId={payment.OrderId}");

                // Update payment status based on code
                // PayOS codes: "00" = success, others = failed/cancelled
                var newStatus = code == "00" ? "PAID" : "CANCELLED";
                payment.Status = newStatus;
                
                if (code == "00")
                {
                    payment.PaidAt = DateTime.UtcNow;
                    
                    // Cập nhật order status khi thanh toán thành công
                    var order = await _orderRepo.GetOrderByIdAsync(payment.OrderId);
                    if (order != null)
                    {
                        order.Status = "Đã thanh toán";
                        Console.WriteLine($"✅ Webhook: Order {payment.OrderId} status updated to 'Đã thanh toán'");
                    }
                }

                await _paymentRepo.UpdatePaymentAsync(payment);
                await _orderRepo.SaveChangesAsync();

                Console.WriteLine($"✅ Webhook: Payment updated - OrderCode={orderCode}, Status={newStatus}, OrderId={payment.OrderId}");

                // Return success response (PayOS expects 200 OK)
                return Ok(new { 
                    code = "00", 
                    desc = "Success",
                    data = new { orderCode }
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Webhook error: {ex.Message}");
                Console.WriteLine($"   Stack trace: {ex.StackTrace}");
                return StatusCode(500, new { error = "Internal server error", detail = ex.Message });
            }
        }

        // ===== Helper: Tạo HMAC-SHA256 Signature =====
        /// <summary>
        /// Tạo chữ ký HMAC-SHA256 để xác thực dữ liệu với PayOS
        /// </summary>
        /// <param name="key">Checksum key từ PayOS dashboard</param>
        /// <param name="data">Chuỗi dữ liệu cần ký (format: key=value&key=value)</param>
        /// <returns>Signature dạng hexadecimal lowercase (64 ký tự)</returns>
        private static string CreateHmacSha256(string key, string data)
        {
            // Tạo HMAC-SHA256 với key và data (cả hai đều dùng UTF-8 encoding)
            using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(key));
            var hashBytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(data));
            
            // Chuyển đổi hash bytes sang hexadecimal string (lowercase)
            // BitConverter.ToString() tạo format: "AA-BB-CC-DD..."
            // Replace("-", "") để bỏ dấu gạch ngang: "AABBCCDD..."
            // ToLowerInvariant() để đảm bảo lowercase: "aabbccdd..."
            return BitConverter.ToString(hashBytes).Replace("-", "").ToLowerInvariant();
        }
    }
}

