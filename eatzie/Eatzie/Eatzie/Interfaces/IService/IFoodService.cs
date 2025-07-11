using Eatzie.DTOs.Response;
using Eatzie.DTOs.Request;

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
    }
}