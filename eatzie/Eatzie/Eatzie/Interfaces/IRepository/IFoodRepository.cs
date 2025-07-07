using Eatzie.Models;

namespace Eatzie.Interfaces.IRepository
{
    public interface IFoodRepository
    {
        Task<UserDietEntity> GetUserDietAsync(int userId);
        Task<List<FoodEntity>> GetAvailableFoodsAsync(int userId);
        Task SaveHistoryAsync(int userId, List<FoodEntity> foods);
    }
}