using Eatzie.Models;

namespace Eatzie.Interfaces.IRepository
{
    public interface ICartRepository
    {
        Task<CartItemEntity?> GetCartItemAsync(int userId, int foodId);
        Task<List<CartItemEntity>> GetCartItemsAsync(int userId);

        Task AddCartItemAsync(CartItemEntity item);
        Task RemoveCartItemAsync(CartItemEntity item);
        Task RemoveCartItemsAsync(List<CartItemEntity> items);
        Task SaveChangesAsync();
    }
}