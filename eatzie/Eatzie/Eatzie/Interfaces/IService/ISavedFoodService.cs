using Eatzie.DTOs.Request;
using Eatzie.DTOs.Response;
using Eatzie.Helpers;

namespace Eatzie.Interfaces.IService
{
    public interface ISavedFoodService
    {
        Task<BaseAPIResponse> SaveFoodAsync(int userId, SavedFoodRequest request);
        Task<BaseAPIResponse> RemoveSavedFoodAsync(int userId, int foodId);
        Task<List<FoodResponse>> GetSavedFoodsAsync(int userId);
    }
}