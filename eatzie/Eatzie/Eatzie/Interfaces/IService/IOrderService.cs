using Eatzie.DTOs.Response;
using Eatzie.DTOs.Request;
using Eatzie.Helpers;

namespace Eatzie.Interfaces.IService
{
    public interface IOrderService
    {
        Task<BaseAPIResponse> CreateOrderAsync(int userId, CreateOrderRequest request, int OrderId);
        Task<List<OrderResponse>> GetOrdersAsync(int userId);
        Task<OrderResponse?> GetOrderDetailAsync(int orderId);
    }
}