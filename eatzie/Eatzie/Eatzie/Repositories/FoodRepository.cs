using Eatzie.Data;
using Eatzie.Interfaces.IRepository;
using Eatzie.Models;
using Microsoft.EntityFrameworkCore;

namespace Eatzie.Repositories
{
    public class FoodRepository : IFoodRepository
    {
        private readonly ApplicationDbContext _context;

        public FoodRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<UserDietEntity> GetUserDietAsync(int userId)
        {
            return await _context.UserDietEntitys
                .Include(d => d.UserDietFoods)
                .ThenInclude(udf => udf.Food)
                .FirstOrDefaultAsync(d => d.UserId == userId);
        }

        public async Task<List<FoodEntity>> GetAvailableFoodsAsync(int userId)
        {
            var threeDaysAgo = DateTime.UtcNow.AddDays(-3);

            var excludedFoodIds = await _context.HistoryFoodEntitys
                .Where(h => h.UserId == userId && h.SuggestedAt >= threeDaysAgo)
                .Select(h => h.Food_id)
                .ToListAsync();

            return await _context.Foods
                .Where(f => !excludedFoodIds.Contains(f.Id))
                .ToListAsync();
        }

        public async Task SaveHistoryAsync(int userId, List<FoodEntity> foods)
        {
            foreach (var food in foods)
            {
                _context.HistoryFoodEntitys.Add(new HistoryFoodEntity
                {
                    UserId = userId,
                    Food_id = food.Id,
                    SuggestedAt = DateTime.UtcNow,
                    IsSelected = false
                });
            }

            await _context.SaveChangesAsync();
        }
        public async Task<List<HistoryFoodEntity>> GetAllHistoryFoodsAsync(int userId)
        {
            return await _context.HistoryFoodEntitys
                .Include(h => h.Food)
                .Where(h => h.UserId == userId)
                .ToListAsync();
        }
        /// <summary>
        /// Food History Detail
        /// </summary>
        /// <param name="foodId"></param>
        /// <returns></returns>
        public async Task<FoodEntity?> GetFoodDetailByIdAsync(int foodId)
        {
            return await _context.Foods
                .Where(f => f.Id == foodId)
                .FirstOrDefaultAsync();
        }
        /// <summary>
        /// CRUD for Food - Restaurant
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<FoodEntity?> GetFoodByIdAsync(int id)
        {
            return await _context.Foods
                .Include(f => f.RestaurantFoods)
                .FirstOrDefaultAsync(f => f.Id == id);
        }

        public async Task<bool> AddFoodAsync(FoodEntity food)
        {
            _context.Foods.Add(food);
            return await SaveChangesAsync();
        }

        public async Task<bool> UpdateFoodAsync(FoodEntity food)
        {
            _context.Foods.Update(food);
            return await SaveChangesAsync();
        }

        public async Task<bool> DeleteFoodAsync(FoodEntity food)
        {
            _context.Foods.Remove(food);
            return await SaveChangesAsync();
        }

        public async Task<bool> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
        public async Task<List<FoodEntity>> GetFoodsByNameAsync(string? foodName)
        {
            var query = _context.Foods.AsQueryable();

            if (!string.IsNullOrWhiteSpace(foodName))
            {
                query = query.Where(f => f.Content.Contains(foodName) || f.Description.Contains(foodName));
            }

            return await query.ToListAsync();
        }
    }
}