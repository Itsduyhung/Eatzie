using Eatzie.Data;
using Eatzie.Interfaces.IRepository;
using Eatzie.Models;
using Microsoft.EntityFrameworkCore;

namespace Eatzie.Repositories
{
    public class SavedFoodRepository(ApplicationDbContext context) : ISavedFoodRepository
    {
        private readonly ApplicationDbContext _context = context;

        public async Task<bool> SaveFoodAsync(int userId, int foodId)
        {
            if (await IsFoodSavedAsync(userId, foodId))
                return false;

            var saved = new SavedFoodEntity
            {
                UserId = userId,
                FoodId = foodId,
                SavedAt = DateTime.UtcNow
            };

            _context.SavedFoods.Add(saved);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> RemoveSavedFoodAsync(int userId, int foodId)
        {
            var item = await _context.SavedFoods
                .FirstOrDefaultAsync(x => x.UserId == userId && x.FoodId == foodId);

            if (item == null)
                return false;

            _context.SavedFoods.Remove(item);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<List<FoodEntity>> GetSavedFoodsByUserAsync(int userId)
        {
            return await _context.SavedFoods
                .Where(x => x.UserId == userId)
                .Select(x => x.Food!)
                .ToListAsync();
        }

        public async Task<bool> IsFoodSavedAsync(int userId, int foodId)
        {
            return await _context.SavedFoods
                .AnyAsync(x => x.UserId == userId && x.FoodId == foodId);
        }
    }
}