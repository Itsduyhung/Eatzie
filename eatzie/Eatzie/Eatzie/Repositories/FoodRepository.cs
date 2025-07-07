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
    }
}