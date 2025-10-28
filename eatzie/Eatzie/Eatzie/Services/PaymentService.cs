using Eatzie.Data;
using Eatzie.DTOs.Request;
using Eatzie.DTOs.Response;
using Eatzie.Helpers;
using Eatzie.Interfaces.IRepository;
using Eatzie.Interfaces.IService;
using Eatzie.Models;
using Microsoft.Extensions.Options;
using System.Security.Cryptography;
using System.Text;
using Newtonsoft.Json;

namespace Eatzie.Services
{
    public class PaymentService(
        IPaymentRepository paymentRepo,
        IOrderRepository orderRepo,
        ApplicationDbContext dbContext,
        IOptions<PayOSSettings> payOSSettings
    ) : IPaymentService
    {
        private readonly IPaymentRepository _paymentRepo = paymentRepo;
        private readonly IOrderRepository _orderRepo = orderRepo;
        private readonly ApplicationDbContext _dbContext = dbContext;
        private readonly PayOSSettings _payOSSettings = payOSSettings.Value;
        private readonly HttpClient _httpClient = new();

        public async Task<BaseAPIResponse> CreatePaymentLinkAsync(int userId, CreatePaymentRequest request)
        {
            try
            {
                Console.WriteLine($"Creating payment for OrderId: {request.OrderId}, UserId: {userId}, Amount: {request.Amount}");
                
                // Verify order exists and belongs to user
                var order = await _orderRepo.GetOrderByIdAsync(request.OrderId);
                if (order == null)
                {
                    Console.WriteLine($"Order {request.OrderId} not found");
                    return new BaseAPIResponse("Không tìm thấy đơn hàng.", 404, false);
                }

                Console.WriteLine($"Order found: OrderId={order.Id}, UserId={order.UserId}, Status={order.Status}");
                
                if (order.UserId != userId)
                {
                    Console.WriteLine($"User {userId} does not have access to order {request.OrderId}");
                    return new BaseAPIResponse("Không có quyền truy cập đơn hàng này.", 403, false);
                }

                // Check if payment already exists
                var existingPayment = await _paymentRepo.GetPaymentByOrderIdAsync(request.OrderId);
                if (existingPayment != null)
                {
                    if (existingPayment.Status == "PAID")
                    {
                        return new BaseAPIResponse("Đơn hàng đã được thanh toán.", 400, false);
                    }

                    return new BaseAPIResponse
                    {
                        IsSuccess = true,
                        StatusCode = 200,
                        Data = new PaymentResponse
                        {
                            PaymentId = existingPayment.Id,
                            OrderId = existingPayment.OrderId,
                            PaymentLink = existingPayment.PaymentLink,
                            PayOSCode = existingPayment.PayOSCode,
                            Status = existingPayment.Status,
                            Amount = existingPayment.Amount,
                            CreatedAt = existingPayment.CreatedAt,
                            PaidAt = existingPayment.PaidAt
                        }
                    };
                }

                // TEST MODE: Uncomment this section to bypass PayOS API for testing
                // Remove this when you want to use real PayOS integration
                const bool USE_TEST_MODE = true;
                if (USE_TEST_MODE)
                {
                    Console.WriteLine("⚠️ TEST MODE ENABLED: Generating mock payment without PayOS API");
                    var testOrderCode = new Random().Next(1000000, 9999999);
                    
                    var testPayment = new PaymentEntity
                    {
                        OrderId = request.OrderId,
                        PaymentLink = $"https://test-payment-link.com/checkout/{testOrderCode}",
                        PayOSCode = testOrderCode.ToString(),
                        Status = "PENDING",
                        Amount = request.Amount,
                        CreatedAt = DateTime.UtcNow
                    };

                    await _paymentRepo.AddPaymentAsync(testPayment);
                    await _dbContext.SaveChangesAsync();

                    return new BaseAPIResponse
                    {
                        IsSuccess = true,
                        StatusCode = 200,
                        Data = new PaymentResponse
                        {
                            PaymentId = testPayment.Id,
                            OrderId = testPayment.OrderId,
                            PaymentLink = testPayment.PaymentLink,
                            PayOSCode = testPayment.PayOSCode,
                            Status = testPayment.Status,
                            Amount = testPayment.Amount,
                            CreatedAt = testPayment.CreatedAt,
                            PaidAt = testPayment.PaidAt
                        }
                    };
                }

                // Generate random order code
                var random = new Random();
                var orderCode = random.Next(1000000, 9999999);
                var orderCodeStr = orderCode.ToString();

                // Create payment data
                var paymentData = new
                {
                    orderCode = orderCode,
                    amount = (int)request.Amount,
                    description = request.Description,
                    items = new[]
                    {
                        new
                        {
                            name = $"Đơn hàng #{request.OrderId}",
                            quantity = 1,
                            price = (int)request.Amount
                        }
                    },
                    returnUrl = request.ReturnUrl ?? $"{_payOSSettings.BaseUrl}/payment-return",
                    cancelUrl = request.CancelUrl ?? $"{_payOSSettings.BaseUrl}/payment-cancel"
                };

                var json = JsonConvert.SerializeObject(paymentData);
                Console.WriteLine($"PayOS Request URL: {_payOSSettings.BaseUrl}/payment-requests");
                Console.WriteLine($"PayOS Request Body: {json}");
                
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                _httpClient.DefaultRequestHeaders.Clear();
                _httpClient.DefaultRequestHeaders.Add("x-client-id", _payOSSettings.ClientId);
                _httpClient.DefaultRequestHeaders.Add("x-api-key", _payOSSettings.ApiKey);

                var response = await _httpClient.PostAsync($"{_payOSSettings.BaseUrl}/payment-requests", content);
                var responseContent = await response.Content.ReadAsStringAsync();
                
                Console.WriteLine($"PayOS Response Status: {response.StatusCode}");
                Console.WriteLine($"PayOS Response Body: {responseContent}");

                if (!response.IsSuccessStatusCode)
                {
                    Console.WriteLine($"PayOS API failed with status {response.StatusCode}: {responseContent}");
                    return new BaseAPIResponse($"Không thể tạo link thanh toán. PayOS Error: {responseContent}", 500, false);
                }

                var payOSResponse = JsonConvert.DeserializeObject<PayOSPaymentLinkResponse>(responseContent);

                // Create payment record
                var newPayment = new PaymentEntity
                {
                    OrderId = request.OrderId,
                    PaymentLink = payOSResponse?.data?.checkoutUrl ?? "",
                    PayOSCode = payOSResponse?.data?.orderCode.ToString() ?? orderCodeStr,
                    Status = "PENDING",
                    Amount = request.Amount,
                    CreatedAt = DateTime.UtcNow
                };

                await _paymentRepo.AddPaymentAsync(newPayment);
                await _dbContext.SaveChangesAsync();

                return new BaseAPIResponse
                {
                    IsSuccess = true,
                    StatusCode = 200,
                    Data = new PaymentResponse
                    {
                        PaymentId = newPayment.Id,
                        OrderId = newPayment.OrderId,
                        PaymentLink = newPayment.PaymentLink,
                        PayOSCode = newPayment.PayOSCode,
                        Status = newPayment.Status,
                        Amount = newPayment.Amount,
                        CreatedAt = newPayment.CreatedAt,
                        PaidAt = newPayment.PaidAt
                    }
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Payment creation error: {ex}");
                return new BaseAPIResponse($"Lỗi khi tạo link thanh toán: {ex.Message}", 500, false);
            }
        }

        public async Task<BaseAPIResponse> VerifyPaymentAsync(string paymentCode)
        {
            try
            {
                var payment = await _paymentRepo.GetPaymentByCodeAsync(paymentCode);
                if (payment == null)
                {
                    return new BaseAPIResponse("Không tìm thấy thanh toán.", 404, false);
                }

                if (payment.Status == "PAID")
                {
                    return new BaseAPIResponse
                    {
                        IsSuccess = true,
                        StatusCode = 200,
                        Message = "Thanh toán đã được xác nhận trước đó.",
                        Data = new PaymentResponse
                        {
                            PaymentId = payment.Id,
                            OrderId = payment.OrderId,
                            PaymentLink = payment.PaymentLink,
                            PayOSCode = payment.PayOSCode,
                            Status = payment.Status,
                            Amount = payment.Amount,
                            CreatedAt = payment.CreatedAt,
                            PaidAt = payment.PaidAt
                        }
                    };
                }

                // Call PayOS API to verify payment
                _httpClient.DefaultRequestHeaders.Clear();
                _httpClient.DefaultRequestHeaders.Add("x-client-id", _payOSSettings.ClientId);
                _httpClient.DefaultRequestHeaders.Add("x-api-key", _payOSSettings.ApiKey);

                var response = await _httpClient.GetAsync($"{_payOSSettings.BaseUrl}/payment-requests/{paymentCode}");
                var responseContent = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    return new BaseAPIResponse("Không thể xác minh thanh toán.", 500, false);
                }

                var verifyResponse = JsonConvert.DeserializeObject<PayOSPaymentLinkResponse>(responseContent);

                if (verifyResponse?.data?.status == "PAID")
                {
                    payment.Status = "PAID";
                    payment.PaidAt = DateTime.UtcNow;

                    // Update order status
                    var order = await _orderRepo.GetOrderByIdAsync(payment.OrderId);
                    if (order != null)
                    {
                        order.Status = "Đã thanh toán";
                    }

                    await _paymentRepo.UpdatePaymentAsync(payment);
                    await _dbContext.SaveChangesAsync();

                    return new BaseAPIResponse
                    {
                        IsSuccess = true,
                        StatusCode = 200,
                        Message = "Thanh toán thành công.",
                        Data = new PaymentResponse
                        {
                            PaymentId = payment.Id,
                            OrderId = payment.OrderId,
                            PaymentLink = payment.PaymentLink,
                            PayOSCode = payment.PayOSCode,
                            Status = payment.Status,
                            Amount = payment.Amount,
                            CreatedAt = payment.CreatedAt,
                            PaidAt = payment.PaidAt
                        }
                    };
                }

                return new BaseAPIResponse("Thanh toán chưa hoàn tất.", 400, false);
            }
            catch (Exception ex)
            {
                return new BaseAPIResponse($"Lỗi khi xác minh thanh toán: {ex.Message}", 500, false);
            }
        }

        public async Task<BaseAPIResponse> GetPaymentByOrderIdAsync(int orderId)
        {
            var payment = await _paymentRepo.GetPaymentByOrderIdAsync(orderId);
            if (payment == null)
            {
                return new BaseAPIResponse("Không tìm thấy thanh toán.", 404, false);
            }

            return new BaseAPIResponse
            {
                IsSuccess = true,
                StatusCode = 200,
                Data = new PaymentResponse
                {
                    PaymentId = payment.Id,
                    OrderId = payment.OrderId,
                    PaymentLink = payment.PaymentLink,
                    PayOSCode = payment.PayOSCode,
                    Status = payment.Status,
                    Amount = payment.Amount,
                    CreatedAt = payment.CreatedAt,
                    PaidAt = payment.PaidAt
                }
            };
        }
    }

    // Helper classes for PayOS API response
    public class PayOSPaymentLinkResponse
    {
        public string code { get; set; } = string.Empty;
        public string desc { get; set; } = string.Empty;
        public PayOSPaymentData? data { get; set; }
    }

    public class PayOSPaymentData
    {
        public int? orderCode { get; set; }
        public string? checkoutUrl { get; set; }
        public string? status { get; set; }
        public int? amount { get; set; }
    }
}

