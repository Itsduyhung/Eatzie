using Eatzie.DTOs.Response;
using Eatzie.Helpers;
using Eatzie.Interfaces;
using Eatzie.Interfaces.IRepository;
using Eatzie.Interfaces.IService;
using System.Net;

namespace Eatzie.Services;

public class RestaurantService : IRestaurantService
{
    private readonly IRestaurantRepository _restaurantRepository;

    public RestaurantService(IRestaurantRepository restaurantRepository)
    {
        _restaurantRepository = restaurantRepository;
    }

    public async Task<BaseAPIResponse> GetRestaurantDetailsAsync(int restaurantId)
    {
        var restaurant = await _restaurantRepository.GetRestaurantDetailsWithFoodsAsync(restaurantId);

        if (restaurant == null)
        {
            return new BaseAPIResponse
            {
                IsSuccess = false,
                StatusCode = (int)HttpStatusCode.NotFound,
                Message = "Không tìm thấy nhà hàng."
            };
        }

        var restaurantResponse = new RestaurantResponse
        {
            Id = restaurant.Id,
            Name = restaurant.Name,
            Address = restaurant.Address,
            Status = restaurant.Status == "Open" ? "Đang mở cửa" : "Đóng cửa",
            OperatingHours = "Mở cửa từ 08h30 đến 22h30"
        };

        // Xử lý và nhóm món ăn theo danh mục
        var categorizedFoods = restaurant.RestaurantFoods
            .SelectMany(rf => rf.Food.FoodCategoryItems)
            .GroupBy(fci => fci.Category.Name)
            .Select(g => new FoodCategoryDto
            {
                CategoryName = g.Key,
                Foods = g.Select(fci => new FoodResponse
                {
                    Id = fci.Food.Id,
                    Content = fci.Food.Content,
                    Description = fci.Food.Description,
                    ImageUrl = fci.Food.ImageUrl ?? string.Empty,
                    Price = fci.Food.Price,
                }).ToList()
            }).ToList();

        restaurantResponse.FoodCategories = categorizedFoods;

        return new BaseAPIResponse
        {
            IsSuccess = true,
            StatusCode = (int)HttpStatusCode.OK,
            Message = "Lấy dữ liệu nhà hàng thành công.",
            Data = restaurantResponse
        };
    }
}