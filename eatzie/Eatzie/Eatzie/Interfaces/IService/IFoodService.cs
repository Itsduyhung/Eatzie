using Eatzie.DTOs.Request;
using Eatzie.DTOs.Response;
using Eatzie.Helpers;

namespace Eatzie.Interfaces.IService
{
    public interface IFoodService
    {
        Task<List<FoodResponse>> SuggestFoodsAsync(int userId, int count = 3);
        Task<List<FoodResponse>> GetAllHistoryFoodsAsync(int userId);
        Task<FoodResponse?> GetFoodDetailAsync(int foodId);
        Task AddFoodViewAsync(int? userId, int foodId, string deviceInfo);
        Task CreateFeedbackAsync(FeedbackRequest request);
        Task<List<FeedbackResponse>> GetFeedbacksByFoodIdAsync(int foodId);
        Task<bool> UpdateFeedbackAsync(int feedbackId, int userId, FeedbackRequest request);
        Task<bool> DeleteFeedbackAsync(int feedbackId, int userId);

        /// <summary>
        /// Restaurant
        /// </summary>
        /// <param name="foodId"></param>
        /// <returns></returns>
        Task<BaseAPIResponse> GetFoodDetailsAsync(int foodId);
        Task<BaseAPIResponse> CreateFoodAsync(int userId, int restaurantId, FoodCreateRequest dto);
        Task<BaseAPIResponse> UpdateFoodAsync(int userId, int foodId, FoodUpdateRequest dto);
        Task<BaseAPIResponse> DeleteFoodsAsync(int userId, int foodId);
    }
}