using Eatzie.Helpers;
using Eatzie.DTOs.Request;
public interface IRestaurantService
{
    Task<BaseAPIResponse> CreateRestaurantAsync(int userId, RestaurantRequest dto);
    Task<BaseAPIResponse> GetRestaurantByIdAsync(int restaurantId);
    Task<BaseAPIResponse> GetAllRestaurantsAsync();
    Task<BaseAPIResponse> UpdateRestaurantAsync(int userId, int restaurantId, RestaurantRequest dto);
    Task<BaseAPIResponse> DeleteRestaurantAsync(int userId, int restaurantId);
}