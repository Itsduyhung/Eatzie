using Eatzie.Models;

namespace Eatzie.Interfaces.IRepository
{
    public interface ISavedFoodRepository
    {
        Task<bool> SaveFoodAsync(int userId, int foodId);
        Task<bool> RemoveSavedFoodAsync(int userId, int foodId);
        Task<List<FoodEntity>> GetSavedFoodsByUserAsync(int userId);
        Task<bool> IsFoodSavedAsync(int userId, int foodId);
    }
}