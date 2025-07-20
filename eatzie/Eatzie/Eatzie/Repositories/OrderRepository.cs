using Eatzie.Data;
using Eatzie.Interfaces.IRepository;
using Eatzie.Models;
using Microsoft.EntityFrameworkCore;

namespace Eatzie.Repositories
{
    public class OrderRepository(ApplicationDbContext dbContext) : IOrderRepository
    {
        private readonly ApplicationDbContext _db = dbContext;

        public async Task<List<OrderEntity>> GetOrdersByUserIdAsync(int userId)
        {
            return await _db.Orders
                .Include(o => o.OrderDetails)
                .ThenInclude(d => d.Food)
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }

        public async Task<OrderEntity?> GetOrderByIdAsync(int orderId)
        {
            return await _db.Orders
                .Include(o => o.OrderDetails)
                .ThenInclude(d => d.Food)
                .FirstOrDefaultAsync(o => o.Id == orderId);
        }

        public async Task AddOrderAsync(OrderEntity order)
        {
            await _db.Orders.AddAsync(order);
        }

        public async Task SaveChangesAsync()
        {
            await _db.SaveChangesAsync();
        }
    }
}