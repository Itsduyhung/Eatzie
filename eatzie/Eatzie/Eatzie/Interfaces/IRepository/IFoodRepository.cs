using Eatzie.Models;

namespace Eatzie.Interfaces.IRepository
{
    public interface IFoodRepository
    {
        Task<UserDietEntity> GetUserDietAsync(int userId);
        Task<List<FoodEntity>> GetAvailableFoodsAsync(int userId);
        Task SaveHistoryAsync(int userId, List<FoodEntity> foods);

        /// <summary>
        /// History food
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        Task<List<HistoryFoodEntity>> GetAllHistoryFoodsAsync(int userId);
        Task<FoodEntity?> GetFoodDetailByIdAsync(int foodId);

        /// <summary>
        /// Restaurant
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        Task<FoodEntity?> GetFoodByIdAsync(int id);
        Task<bool> AddFoodAsync(FoodEntity food);
        Task<bool> UpdateFoodAsync(FoodEntity food);
        Task<bool> DeleteFoodAsync(FoodEntity food);
        Task<bool> SaveChangesAsync();
    }
}