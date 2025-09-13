using Eatzie.Data;
using Eatzie.Interfaces;
using Eatzie.Interfaces.IRepository;
using Eatzie.Models;
using Microsoft.EntityFrameworkCore;

namespace Eatzie.Repositories;

public class RestaurantRepository : IRestaurantRepository
{
    private readonly ApplicationDbContext _context;

    public RestaurantRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<RestaurantEntity?> GetRestaurantByIdAsync(int id)
    {
        return await _context.Restaurants
            .Include(r => r.RestaurantFoods)
            .ThenInclude(rf => rf.Food)
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task<RestaurantEntity?> GetRestaurantDetailsWithFoodsAsync(int id)
    {
        return await _context.Restaurants
            .Include(r => r.RestaurantFoods)
                .ThenInclude(rf => rf.Food)
                    .ThenInclude(f => f.FoodCategoryItems)
                        .ThenInclude(fci => fci.Category)
            .FirstOrDefaultAsync(r => r.Id == id);
    }
}