using Eatzie.DTOs.Response;
using Eatzie.Helpers;

namespace Eatzie.Interfaces.IService;

public interface IRestaurantService
{
    Task<BaseAPIResponse> GetRestaurantDetailsAsync(int restaurantId);
}