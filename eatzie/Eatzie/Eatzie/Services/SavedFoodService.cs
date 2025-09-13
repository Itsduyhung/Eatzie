using Eatzie.DTOs.Request;
using Eatzie.DTOs.Response;
using Eatzie.Helpers;
using Eatzie.Interfaces.IRepository;
using Eatzie.Interfaces.IService;

namespace Eatzie.Services
{
    public class SavedFoodService(ISavedFoodRepository savedFoodRepository) : ISavedFoodService
    {
        private readonly ISavedFoodRepository _savedFoodRepository = savedFoodRepository;

        public async Task<BaseAPIResponse> SaveFoodAsync(int userId, SavedFoodRequest request)
        {
            var success = await _savedFoodRepository.SaveFoodAsync(userId, request.FoodId);
            if (!success)
                return new BaseAPIResponse("Món ăn đã được lưu hoặc lỗi xảy ra.", 400, false);

            return new BaseAPIResponse("Lưu món ăn thành công.", 200, true);
        }

        public async Task<BaseAPIResponse> RemoveSavedFoodAsync(int userId, int foodId)
        {
            var success = await _savedFoodRepository.RemoveSavedFoodAsync(userId, foodId);
            if (!success)
                return new BaseAPIResponse("Không tìm thấy món ăn đã lưu.", 404, false);

            return new BaseAPIResponse("Xóa món ăn đã lưu thành công.", 200, true);
        }

        public async Task<List<FoodResponse>> GetSavedFoodsAsync(int userId)
        {
            var savedFoods = await _savedFoodRepository.GetSavedFoodsByUserAsync(userId);

            var response = savedFoods.Select(food => new FoodResponse
            {
                Id = food.Id,
                Content = food.Content,
                Description = food.Description,
                ImageUrl = food.ImageUrl ?? string.Empty,
                IsVegetarian = food.IsVegetarian,
                Address = food.Address,
                TotalViews = food.FoodViews?.Count ?? 0,
                AverageRating = food.Feedbacks != null && food.Feedbacks.Count != 0
                    ? Math.Round(food.Feedbacks.Average(f => f.Rating), 1)
                    : 0.0,
                Price = food.Price
            }).ToList();

            return response;
        }
    }
}