using Eatzie.DTOs.Response;
using Eatzie.Helpers;

namespace Eatzie.Interfaces.IService
{
    public interface IOrderService
    {
        Task<BaseAPIResponse> CreateOrderAsync(int userId, decimal totalPrice);
        Task<List<OrderResponse>> GetOrdersAsync(int userId);
        Task<OrderResponse?> GetOrderDetailAsync(int orderId);
    }
}