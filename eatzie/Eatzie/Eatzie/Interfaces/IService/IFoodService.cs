using Eatzie.DTOs.Response;

namespace Eatzie.Interfaces.IService
{
    public interface IFoodService
    {
        Task<List<FoodResponse>> SuggestFoodsAsync(int userId, int count = 3);
    }
}