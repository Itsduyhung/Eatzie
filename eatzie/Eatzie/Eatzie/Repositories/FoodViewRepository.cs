using Eatzie.Data;
using Eatzie.Interfaces.IRepository;
using Eatzie.Models;

namespace Eatzie.Repositories
{
    public class FoodViewRepository : IFoodViewRepository
    {
        private readonly ApplicationDbContext _context;

        public FoodViewRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(FoodViewEntity view)
        {
            _context.FoodViews.Add(view);
            await _context.SaveChangesAsync();
        }
    }
}