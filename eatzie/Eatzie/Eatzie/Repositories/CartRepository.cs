using Eatzie.Data;
using Eatzie.Interfaces.IRepository;
using Eatzie.Models;
using Microsoft.EntityFrameworkCore;

namespace Eatzie.Repositories
{
    public class CartRepository(ApplicationDbContext dbContext) : ICartRepository
    {
        private readonly ApplicationDbContext _db = dbContext;

        public async Task<CartItemEntity?> GetCartItemAsync(int userId, int foodId)
        {
            return await _db.CartItems.FirstOrDefaultAsync(x => x.UserId == userId && x.FoodId == foodId);
        }

        public async Task<List<CartItemEntity>> GetCartItemsAsync(int userId)
        {
            return await _db.CartItems.Include(c => c.Food).Where(c => c.UserId == userId).ToListAsync();
        }

        public async Task AddCartItemAsync(CartItemEntity item)
        {
            await _db.CartItems.AddAsync(item);
        }

        public async Task RemoveCartItemAsync(CartItemEntity item)
        {
            _db.CartItems.Remove(item);
        }

        public async Task RemoveCartItemsAsync(List<CartItemEntity> items)
        {
            _db.CartItems.RemoveRange(items);
        }

        public async Task SaveChangesAsync()
        {
            await _db.SaveChangesAsync();
        }

    }
}