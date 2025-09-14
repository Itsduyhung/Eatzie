using Eatzie.Models;
public interface IRestaurantRepository
{
    Task<RestaurantEntity> GetRestaurantByIdAsync(int restaurantId);
    Task<List<RestaurantEntity>> GetAllRestaurantsAsync();
    Task AddRestaurantAsync(RestaurantEntity restaurant);
    Task<bool> UpdateRestaurantAsync(RestaurantEntity restaurant);
    Task<bool> DeleteRestaurantAsync(RestaurantEntity restaurant);
}