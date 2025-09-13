using Eatzie.Models;

namespace Eatzie.Interfaces.IRepository;

public interface IRestaurantRepository
{
    Task<RestaurantEntity?> GetRestaurantByIdAsync(int id);
    Task<RestaurantEntity?> GetRestaurantDetailsWithFoodsAsync(int id);
}