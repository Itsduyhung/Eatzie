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

            // Lượt xem
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
    }
}
