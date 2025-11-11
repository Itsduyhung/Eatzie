using Eatzie.DTOs.Request;
using Eatzie.DTOs.Response;
using Eatzie.Helpers;

namespace Eatzie.Interfaces.IService
{
    public interface IPaymentService
    {
        Task<BaseAPIResponse> CreatePaymentLinkAsync(int userId, CreatePaymentRequest request);
        Task<BaseAPIResponse> VerifyPaymentAsync(string paymentCode);
        Task<BaseAPIResponse> VerifyPaymentByOrderIdAsync(int orderId);
        Task<BaseAPIResponse> GetPaymentByOrderIdAsync(int orderId);
    }
}



