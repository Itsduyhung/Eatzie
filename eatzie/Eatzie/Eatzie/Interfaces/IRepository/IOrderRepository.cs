using Eatzie.Models;

namespace Eatzie.Interfaces.IRepository
{
    public interface IOrderRepository
    {
        Task<List<OrderEntity>> GetOrdersByUserIdAsync(int userId);
        Task<OrderEntity?> GetOrderByIdAsync(int orderId);
        Task AddOrderAsync(OrderEntity order);
        Task SaveChangesAsync();
    }
}