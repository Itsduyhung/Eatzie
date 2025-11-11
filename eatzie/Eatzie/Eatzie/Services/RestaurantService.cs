using Eatzie.Data;
using Eatzie.DTOs.Request;
using Eatzie.DTOs.Response;
using Eatzie.Helpers;
using Eatzie.Models;
using Eatzie.Services;
using Microsoft.EntityFrameworkCore;
using System.Net;

public class RestaurantService : IRestaurantService
{
    private readonly IRestaurantRepository _restaurantRepository;
    private readonly ApplicationDbContext _context;
    private readonly IPhotoService _photoService;

    public RestaurantService(IRestaurantRepository restaurantRepository, ApplicationDbContext context, IPhotoService photoService)
    {
        _restaurantRepository = restaurantRepository;
        _context = context;
        _photoService = photoService;
    }

    public async Task<BaseAPIResponse> UserHasRestaurantAsync(int userId)
    {
        var hasRestaurant = await _restaurantRepository.UserHasRestaurantAsync(userId);
        return new BaseAPIResponse
        {
            IsSuccess = true,
            StatusCode = (int)HttpStatusCode.OK,
            Data = hasRestaurant
        };
    }

    private RestaurantResponse MapToResponseDto(RestaurantEntity restaurant)
    {
        return new RestaurantResponse
        {
            Id = restaurant.Id,
            Name = restaurant.Name,
            Description = restaurant.Description,
            Address = restaurant.Address,
            PhoneNumber = restaurant.PhoneNumber,
            ImageUrl = restaurant.ImageUrl,
            Latitude = restaurant.Latitude,
            Longitude = restaurant.Longitude,
            CreatedAt = restaurant.CreatedAt,
            Status = restaurant.Status
        };
    }

    public async Task<BaseAPIResponse> CreateRestaurantAsync(int userId, RestaurantRequest dto)
    {
        string? imageUrl = null;
        if (dto.ImageUrl != null)
        {
            imageUrl = await _photoService.UploadPhotoAsync(dto.ImageUrl);
        }

        var newRestaurant = new RestaurantEntity
        {
            Name = dto.Name,
            Description = dto.Description,
            Address = dto.Address,
            PhoneNumber = dto.PhoneNumber,
            ImageUrl = imageUrl,
            Latitude = dto.Latitude,
            Longitude = dto.Longitude,
            UserId = userId,
            Status = "active",
            CreatedAt = DateTime.UtcNow
        };

        await _restaurantRepository.AddRestaurantAsync(newRestaurant);

        var responseDto = MapToResponseDto(newRestaurant);

        return new BaseAPIResponse
        {
            IsSuccess = true,
            StatusCode = (int)HttpStatusCode.Created,
            Message = "Tạo nhà hàng thành công.",
            Data = responseDto
        };
    }

    public async Task<BaseAPIResponse> GetRestaurantByIdAsync(int restaurantId)
    {
        var restaurant = await _restaurantRepository.GetRestaurantByIdAsync(restaurantId);

        if (restaurant == null)
        {
            return new BaseAPIResponse
            {
                IsSuccess = false,
                StatusCode = (int)HttpStatusCode.NotFound,
                Message = "Không tìm thấy nhà hàng."
            };
        }

        var responseDto = MapToResponseDto(restaurant);

        var foods = await _context.RestaurantFoods
            .Where(rf => rf.RestaurantId == restaurantId)
            .Select(rf => new FoodBriefResponse
            {
                Id = rf.Food.Id,
                Content = rf.Food.Content,
                Description = rf.Food.Description,
                Price = rf.Food.Price,
                ImageUrl = rf.Food.ImageUrl,
                IsVegetarian = rf.Food.IsVegetarian,
                CreatedAt = rf.Food.CreatedAt
            })
            .ToListAsync();

        var categories = await _context.FoodCategories
            .Where(fc => fc.FoodCategoryItems.Any(fci => fci.Food.RestaurantFoods.Any(rf => rf.RestaurantId == restaurantId)))
            .Select(fc => new FoodCategoryDto
            {
                Id = fc.Id,
                Name = fc.Name,
                // Thuộc tính Foods sẽ được populate sau nếu cần
            })
            .ToListAsync();

        responseDto.RestaurantFoods = foods;
        responseDto.FoodCategories = categories;

        return new BaseAPIResponse
        {
            IsSuccess = true,
            StatusCode = (int)HttpStatusCode.OK,
            Data = responseDto
        };
    }

    public async Task<BaseAPIResponse> GetAllRestaurantsAsync()
    {
        var restaurants = await _restaurantRepository.GetAllRestaurantsAsync();

        var responseData = restaurants.Select(r => MapToResponseDto(r)).ToList();

        return new BaseAPIResponse
        {
            IsSuccess = true,
            StatusCode = (int)HttpStatusCode.OK,
            Data = responseData
        };
    }

    public async Task<BaseAPIResponse> UpdateRestaurantAsync(int userId, int restaurantId, RestaurantRequest dto)
    {
        var existingRestaurant = await _restaurantRepository.GetRestaurantByIdAsync(restaurantId);

        if (existingRestaurant == null)
        {
            return new BaseAPIResponse
            {
                IsSuccess = false,
                StatusCode = (int)HttpStatusCode.NotFound,
                Message = "Không tìm thấy nhà hàng."
            };
        }

        if (existingRestaurant.UserId != userId)
        {
            return new BaseAPIResponse
            {
                IsSuccess = false,
                StatusCode = (int)HttpStatusCode.Forbidden,
                Message = "Bạn không có quyền chỉnh sửa nhà hàng này."
            };
        }

        if (!string.IsNullOrEmpty(dto.Name)) existingRestaurant.Name = dto.Name;
        if (!string.IsNullOrEmpty(dto.Description)) existingRestaurant.Description = dto.Description;
        if (!string.IsNullOrEmpty(dto.Address)) existingRestaurant.Address = dto.Address;
        if (!string.IsNullOrEmpty(dto.PhoneNumber)) existingRestaurant.PhoneNumber = dto.PhoneNumber;
        if (!string.IsNullOrEmpty(dto.Status)) existingRestaurant.Status = dto.Status;

        if (dto.ImageUrl != null)
        {
            existingRestaurant.ImageUrl = await _photoService.UploadPhotoAsync(dto.ImageUrl);
        }

        if (dto.Latitude.HasValue) existingRestaurant.Latitude = dto.Latitude.Value;
        if (dto.Longitude.HasValue) existingRestaurant.Longitude = dto.Longitude.Value;

        var isUpdated = await _restaurantRepository.UpdateRestaurantAsync(existingRestaurant);

        if (!isUpdated)
        {
            return new BaseAPIResponse
            {
                IsSuccess = false,
                StatusCode = (int)HttpStatusCode.InternalServerError,
                Message = "Không thể cập nhật nhà hàng."
            };
        }

        var responseDto = MapToResponseDto(existingRestaurant);

        return new BaseAPIResponse
        {
            IsSuccess = true,
            StatusCode = (int)HttpStatusCode.OK,
            Message = "Cập nhật nhà hàng thành công.",
            Data = responseDto
        };
    }

    public async Task<BaseAPIResponse> DeleteRestaurantAsync(int userId, int restaurantId)
    {
        var restaurant = await _restaurantRepository.GetRestaurantByIdAsync(restaurantId);

        if (restaurant == null)
        {
            return new BaseAPIResponse
            {
                IsSuccess = false,
                StatusCode = (int)HttpStatusCode.NotFound,
                Message = "Không tìm thấy nhà hàng."
            };
        }

        if (restaurant.UserId != userId)
        {
            return new BaseAPIResponse
            {
                IsSuccess = false,
                StatusCode = (int)HttpStatusCode.Forbidden,
                Message = "Bạn không có quyền xóa nhà hàng này."
            };
        }

        var isDeleted = await _restaurantRepository.DeleteRestaurantAsync(restaurant);

        if (!isDeleted)
        {
            return new BaseAPIResponse
            {
                IsSuccess = false,
                StatusCode = (int)HttpStatusCode.InternalServerError,
                Message = "Không thể xóa nhà hàng."
            };
        }

        return new BaseAPIResponse
        {
            IsSuccess = true,
            StatusCode = (int)HttpStatusCode.NoContent,
            Message = "Xóa nhà hàng thành công."
        };
    }
    public async Task<BaseAPIResponse> GetAllFoodRestaurantsByIdAsync(int restaurantId)
    {
        var foods = await _context.RestaurantFoods
            .Where(rf => rf.RestaurantId == restaurantId)
            .Select(rf => new FoodBriefResponse
            {
                Id = rf.Food.Id,
                Content = rf.Food.Content,
                Description = rf.Food.Description,
                Price = rf.Food.Price,
                ImageUrl = rf.Food.ImageUrl,
                IsVegetarian = rf.Food.IsVegetarian,
                CreatedAt = rf.Food.CreatedAt,
                RestaurantName = rf.Restaurant.Name,
                RestaurantId = rf.RestaurantId,
            })
            .ToListAsync();

        return new BaseAPIResponse
        {
            IsSuccess = true,
            StatusCode = 200,
            Data = foods
        };
    }

    public async Task<BaseAPIResponse> GetRestaurantsByUserIdAsync(int userId)
    {
        var restaurants = await _restaurantRepository.GetRestaurantsByUserIdAsync(userId);

        var responseData = restaurants.Select(r => MapToResponseDto(r)).ToList();

        return new BaseAPIResponse
        {
            IsSuccess = true,
            StatusCode = (int)HttpStatusCode.OK,
            Data = responseData
        };
    }
}