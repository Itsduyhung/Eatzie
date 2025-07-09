using Eatzie.DTOs.Response;

namespace Eatzie.Interfaces.IService
{
    public interface IFoodService
    {
        Task<List<FoodResponse>> SuggestFoodsAsync(int userId, int count = 3);
        Task<List<FoodResponse>> GetAllHistoryFoodsAsync(int userId);
        Task<FoodResponse?> GetFoodDetailAsync(int foodId);
    }
}