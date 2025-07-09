using Eatzie.Data;
using Eatzie.DTOs.Response;
using Eatzie.Enum;
using Eatzie.Interfaces.IRepository;
using Eatzie.Interfaces.IService;
using Eatzie.Models;
using Eatzie.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace Eatzie.Services
{
    public class FoodService(IFoodRepository foodrepository, ApplicationDbContext context) : IFoodService
    {
        private readonly IFoodRepository _foodRepository = foodrepository;
        private readonly ApplicationDbContext _context = context;

        public async Task<List<FoodResponse>> SuggestFoodsAsync(int userId, int count = 3)
        {
            var userDiet = await _foodRepository.GetUserDietAsync(userId);
            if (userDiet == null) return new List<FoodResponse>();

            // Nếu đã được suggest ≥ 18 món thì reset lại lịch sử
            var totalHistoryCount = await _context.HistoryFoodEntitys
                .Where(h => h.UserId == userId)
                .CountAsync();

            if (totalHistoryCount >= 18)
            {
                var userHistories = await _context.HistoryFoodEntitys
                    .Where(h => h.UserId == userId)
                    .ToListAsync();

                _context.HistoryFoodEntitys.RemoveRange(userHistories);
                await _context.SaveChangesAsync();
            }

            // Lấy danh sách món chưa từng được suggest trong 3 ngày gần nhất
            var availableFoods = await _foodRepository.GetAvailableFoodsAsync(userId);

            // 1. Filter theo chế độ ăn (Vegetarian, Savory, Both)
            var dietType = (DietTypeEnum)userDiet.Diet_type;

            var filteredFoods = availableFoods.Where(f =>
                dietType == DietTypeEnum.Both ||
                (dietType == DietTypeEnum.Vegetarian && f.IsVegetarian == true) ||
                (dietType == DietTypeEnum.Savory && f.IsVegetarian != true)
            ).ToList();

            // 2. Loại bỏ món user dị ứng
            if (!string.IsNullOrWhiteSpace(userDiet.Allergic_food))
            {
                var allergies = userDiet.Allergic_food.Split(',', StringSplitOptions.RemoveEmptyEntries)
                    .Select(a => a.Trim().ToLower()).ToList();

                filteredFoods = filteredFoods
                    .Where(f => allergies.All(allergy => !f.Description.ToLower().Contains(allergy)))
                    .ToList();
            }

            // 3. Ưu tiên món yêu thích nếu có
            if (!string.IsNullOrWhiteSpace(userDiet.Favorite_food))
            {
                var favorites = userDiet.Favorite_food.Split(',', StringSplitOptions.RemoveEmptyEntries)
                    .Select(fav => fav.Trim().ToLower()).ToList();

                filteredFoods = filteredFoods
                    .OrderByDescending(f => favorites.Any(fav => f.Description.ToLower().Contains(fav)))
                    .ToList();
            }

            // Lấy n món để gợi ý
            var suggestions = filteredFoods.Take(count).ToList();
            var foodIds = suggestions.Select(f => f.Id).ToList();

            var views = await _context.Set<FoodViewEntity>()
                .Where(v => foodIds.Contains(v.Food_id))
                .GroupBy(v => v.Food_id)
                .Select(g => new { FoodId = g.Key, ViewCount = g.Count() })
                .ToDictionaryAsync(g => g.FoodId, g => g.ViewCount);

            // Đánh giá
            var ratings = await _context.Set<FeedbackEntity>()
                .Where(f => foodIds.Contains(f.Food_id))
                .GroupBy(f => f.Food_id)
                .Select(g => new { FoodId = g.Key, AvgRating = g.Average(f => f.Rating) })
                .ToDictionaryAsync(g => g.FoodId, g => g.AvgRating);

            // Trả kết quả
            var result = suggestions.Select(f => new FoodResponse
            {
                Id = f.Id,
                Content = f.Content,
                Description = f.Description,
                ImageUrl = f.ImageUrl,
                IsVegetarian = f.IsVegetarian,
                TotalViews = views.ContainsKey(f.Id) ? views[f.Id] : 0,
                AverageRating = ratings.ContainsKey(f.Id) ? Math.Round(ratings[f.Id], 2) : 0
            }).ToList();

            await _foodRepository.SaveHistoryAsync(userId, suggestions);
            return result;
        }

    public async Task<List<FoodResponse>> GetAllHistoryFoodsAsync(int userId)
        {
            var histories = await _foodRepository.GetAllHistoryFoodsAsync(userId);

            var result = histories.Select(h => new FoodResponse
            {
                Id = h.Food.Id,
                Content = h.Food.Content,
                Description = h.Food.Description,
                ImageUrl = h.Food.ImageUrl,
                IsVegetarian = h.Food.IsVegetarian,
                Address = h.Food.Address,
                TotalViews = _context.FoodViewEntitys.Count(v => v.Food_id == h.Food.Id),
                AverageRating = Math.Round(
                    _context.FeedbackEntitys
                        .Where(f => f.Food_id == h.Food.Id)
                        .Average(f => (double?)f.Rating) ?? 0, 2)
            }).ToList();

            return result;
        }

        public async Task<FoodResponse?> GetFoodDetailAsync(int foodId)
        {
            var food = await _foodRepository.GetFoodDetailByIdAsync(foodId);
            if (food == null) return null;

            var views = await _context.FoodViewEntitys
                .Where(v => v.Food_id == foodId)
                .CountAsync();

            var avgRating = await _context.FeedbackEntitys
                .Where(f => f.Food_id == foodId)
                .AverageAsync(f => (double?)f.Rating) ?? 0;

            return new FoodResponse
            {
                Id = food.Id,
                Content = food.Content,
                Description = food.Description,
                ImageUrl = food.ImageUrl,
                IsVegetarian = food.IsVegetarian,
                Address = food.Address,
                TotalViews = views,
                AverageRating = Math.Round(avgRating, 2)
            };
        }
    }
}