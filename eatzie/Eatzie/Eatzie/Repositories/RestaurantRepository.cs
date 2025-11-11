using Eatzie.Data;
using Eatzie.Models;
using Microsoft.EntityFrameworkCore;

public class RestaurantRepository : IRestaurantRepository
{
    private readonly ApplicationDbContext _context;

    public RestaurantRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<RestaurantEntity> GetRestaurantByIdAsync(int restaurantId)
    {
        return await _context.Restaurants.FindAsync(restaurantId);
    }

    public async Task<List<RestaurantEntity>> GetAllRestaurantsAsync()
    {
        return await _context.Restaurants.ToListAsync();
    }

    public async Task AddRestaurantAsync(RestaurantEntity restaurant)
    {
        _context.Restaurants.Add(restaurant);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> UpdateRestaurantAsync(RestaurantEntity restaurant)
    {
        _context.Restaurants.Update(restaurant);
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<bool> DeleteRestaurantAsync(RestaurantEntity restaurant)
    {
        _context.Restaurants.Remove(restaurant);
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<bool> UserHasRestaurantAsync(int userId)
    {
        return await _context.Restaurants.AnyAsync(r => r.UserId == userId);
    }
}