using Eatzie.Data;
using Eatzie.DTOs.Request;
using Eatzie.DTOs.Response;
using Eatzie.Enum;
using Eatzie.Helpers;
using Eatzie.Interfaces.IRepository;
using Eatzie.Interfaces.IService;
using Eatzie.Models;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace Eatzie.Services;

public class FoodService : IFoodService
{
    private readonly IFoodRepository _foodRepository;
    private readonly IFoodViewRepository _foodViewRepo;
    private readonly IFeedbackRepository _feedbackRepo;
    private readonly IRestaurantRepository _restaurantRepository;
    private readonly ApplicationDbContext _context;
    private readonly IPhotoService _photoService;

    public FoodService(
        IFoodRepository foodRepository,
        IFoodViewRepository foodViewRepo,
        IFeedbackRepository feedbackRepo,
        IRestaurantRepository restaurantRepository,
        ApplicationDbContext context,
        IPhotoService photoService
    )
    {
        _foodRepository = foodRepository;
        _foodViewRepo = foodViewRepo;
        _feedbackRepo = feedbackRepo;
        _restaurantRepository = restaurantRepository;
        _context = context;
        _photoService = photoService;
    }

    public async Task<List<FoodResponse>> SuggestFoodsAsync(int userId, int count = 3)
    {
        var suggestions = await _foodRepository.GetSuggestionsAsync(userId, count);
        var foodIds = suggestions.Select(f => f.Id).ToList();

        var views = await _context.FoodViews
            .Where(v => foodIds.Contains(v.Food_id))
            .GroupBy(v => v.Food_id)
            .Select(g => new { FoodId = g.Key, ViewCount = g.Count() })
            .ToDictionaryAsync(g => g.FoodId, g => g.ViewCount);

        var ratings = await _context.FeedbackEntitys
            .Where(f => foodIds.Contains(f.Food_id))
            .GroupBy(f => f.Food_id)
            .Select(g => new { FoodId = g.Key, AvgRating = g.Average(f => f.Rating) })
            .ToDictionaryAsync(g => g.FoodId, g => g.AvgRating);

        // fetch first restaurant name for each food
        var foodRestaurantNames = await _context.RestaurantFoods
            .Where(rf => foodIds.Contains(rf.FoodId))
            .GroupBy(rf => rf.FoodId)
            .Select(g => new { FoodId = g.Key, Name = g.Select(rf => rf.Restaurant.Name).FirstOrDefault() })
            .ToDictionaryAsync(x => x.FoodId, x => x.Name);

        var result = suggestions.Select(f => new FoodResponse
        {
            Id = f.Id,
            Content = f.Content,
            Description = f.Description,
            ImageUrl = f.ImageUrl ?? string.Empty,
            IsVegetarian = f.IsVegetarian,
            TotalViews = views.ContainsKey(f.Id) ? views[f.Id] : 0,
            AverageRating = ratings.ContainsKey(f.Id) ? Math.Round(ratings[f.Id], 2) : 0,
            RestaurantName = foodRestaurantNames.ContainsKey(f.Id) ? foodRestaurantNames[f.Id] : null
        }).ToList();

        await _foodRepository.SaveHistoryAsync(userId, suggestions);
        return result;
    }

    public async Task<List<FoodResponse>> GetAllHistoryFoodsAsync(int userId)
    {
        var histories = await _foodRepository.GetAllHistoryFoodsAsync(userId);

        var result = histories.Select(h => new FoodResponse
        {
            Id = h.Food.Id,
            Content = h.Food.Content,
            Description = h.Food.Description,
            ImageUrl = h.Food.ImageUrl,
            IsVegetarian = h.Food.IsVegetarian,
            Address = h.Food.Address,
            RestaurantName = _context.RestaurantFoods.Where(rf => rf.FoodId == h.Food.Id)
                .Select(rf => rf.Restaurant.Name).FirstOrDefault(),
            TotalViews = _context.FoodViews.Count(v => v.Food_id == h.Food.Id),
            AverageRating = Math.Round(
                _context.FeedbackEntitys
                    .Where(f => f.Food_id == h.Food.Id)
                    .Average(f => (double?)f.Rating) ?? 0, 2)
        }).ToList();

        return result;
    }

    public async Task<FoodResponse?> GetFoodDetailAsync(int foodId)
    {
        var food = await _foodRepository.GetFoodDetailByIdAsync(foodId);
        if (food == null) return null;

        var views = await _context.FoodViews
            .Where(v => v.Food_id == foodId)
            .CountAsync();

        var avgRating = await _context.FeedbackEntitys
            .Where(f => f.Food_id == foodId)
            .AverageAsync(f => (double?)f.Rating) ?? 0;

        return new FoodResponse
        {
            Id = food.Id,
            Content = food.Content,
            Description = food.Description,
            ImageUrl = food.ImageUrl ?? string.Empty,
            IsVegetarian = food.IsVegetarian,
            Address = food.Address,
            TotalViews = views,
            AverageRating = Math.Round(avgRating, 2),
            RestaurantName = await _context.RestaurantFoods.Where(rf => rf.FoodId == foodId)
                .Select(rf => rf.Restaurant.Name).FirstOrDefaultAsync(),
            Price = food.Price
        };
    }

    public async Task<BaseAPIResponse> AddFoodViewAsync(int? userId, int foodId, string deviceInfo)
    {
        var food = await _foodRepository.GetFoodByIdAsync(foodId);
        if (food == null)
        {
            return new BaseAPIResponse("Món ăn không tồn tại.", 404, false);
        }

        var view = new FoodViewEntity
        {
            UserId = userId,
            Food_id = foodId,
            ViewedAt = DateTime.UtcNow,
            DeviceInfo = deviceInfo
        };
        await _foodViewRepo.AddAsync(view);
        return new BaseAPIResponse("View has been counted.", 200, true);
    }

    public async Task<BaseAPIResponse> CreateFeedbackAsync(int userId, int foodId, FeedbackRequest request)
    {
        var food = await _foodRepository.GetFoodByIdAsync(foodId);
        if (food == null)
        {
            return new BaseAPIResponse("Món ăn không tồn tại.", 404, false);
        }

        var feedback = new FeedbackEntity
        {
            UserId = userId,
            Food_id = foodId,
            Content = request.Content,
            Rating = request.Rating,
            CreatedAt = DateTime.UtcNow,
            IsResolved = false
        };
        await _feedbackRepo.AddAsync(feedback);
        return new BaseAPIResponse("Thêm Feedback thành công.", 201, true);
    }

    public async Task<List<FeedbackResponse>> GetFeedbacksByFoodIdAsync(int foodId)
    {
        var feedbacks = await _context.FeedbackEntitys
            .Where(f => f.Food_id == foodId)
            .OrderByDescending(f => f.CreatedAt)
            .Select(f => new FeedbackResponse
            {
                Id = f.Id,
                Food_id = f.Food_id,
                UserId = f.UserId,
                Content = f.Content,
                Rating = f.Rating,
                CreatedAt = f.CreatedAt,
                IsResolved = f.IsResolved
            }).ToListAsync();

        return feedbacks;
    }

    public async Task<bool> UpdateFeedbackAsync(int feedbackId, int userId, FeedbackRequest request)
    {
        var feedback = await _context.FeedbackEntitys.FirstOrDefaultAsync(f => f.Id == feedbackId);
        if (feedback == null || feedback.UserId != userId) return false;

        feedback.Content = request.Content;
        feedback.Rating = request.Rating;
        //feedback.IsResolved = request.IsResolved;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteFeedbackAsync(int feedbackId, int userId)
    {
        var feedback = await _context.FeedbackEntitys.FirstOrDefaultAsync(f => f.Id == feedbackId);
        if (feedback == null || feedback.UserId != userId) return false;

        _context.FeedbackEntitys.Remove(feedback);
        await _context.SaveChangesAsync();
        return true;
    }

    // --- Các phương thức CRUD cho Food - Restaurant đã được sửa lỗi ---

    public async Task<BaseAPIResponse> GetFoodDetailsAsync(int foodId)
    {
        var food = await _foodRepository.GetFoodByIdAsync(foodId);

        if (food is null)
        {
            return new BaseAPIResponse
            {
                IsSuccess = false,
                StatusCode = (int)HttpStatusCode.NotFound,
                Message = "Không tìm thấy món ăn."
            };
        }

        var viewsCount = await _context.FoodViews.CountAsync(v => v.Food_id == foodId);
        var averageRating = await _context.FeedbackEntitys
            .Where(f => f.Food_id == foodId)
            .AverageAsync(f => (double?)f.Rating) ?? 0;

        var restaurantName = await _context.RestaurantFoods
            .Where(rf => rf.FoodId == foodId)
            .Select(rf => rf.Restaurant.Name)
            .FirstOrDefaultAsync();

        var responseDto = new FoodBriefResponse
        {
            Id = food.Id,
            Content = food.Content,
            Description = food.Description,
            Price = food.Price,
            ImageUrl = food.ImageUrl ?? string.Empty,
            IsVegetarian = food.IsVegetarian,
            CreatedAt = food.CreatedAt,
            RestaurantName = restaurantName,
            TotalViews = viewsCount,
            AverageRating = Math.Round(averageRating, 2)
        };

        return new BaseAPIResponse
        {
            IsSuccess = true,
            StatusCode = (int)HttpStatusCode.OK,
            Message = "Lấy dữ liệu món ăn thành công.",
            Data = responseDto
        };
    }

    public async Task<BaseAPIResponse> CreateFoodAsync(int userId, int restaurantId, FoodCreateRequest dto)
    {
        var restaurant = await _restaurantRepository.GetRestaurantByIdAsync(restaurantId);

        if (restaurant == null || restaurant.UserId != userId)
        {
            return new BaseAPIResponse
            {
                IsSuccess = false,
                StatusCode = (int)HttpStatusCode.Forbidden,
                Message = "Bạn không có quyền thêm món ăn vào nhà hàng này."
            };
        }

        string? imageUrl = null;
        if (dto.ImageUrl != null)
        {
            imageUrl = await _photoService.UploadPhotoAsync(dto.ImageUrl);
        }

        var newFood = new FoodEntity
        {
            Content = dto.Content,
            Description = dto.Description,
            Price = dto.Price,
            ImageUrl = imageUrl ?? string.Empty,
            IsVegetarian = dto.IsVegetarian,
            Address = restaurant.Address
        };

        await _foodRepository.AddFoodAsync(newFood);

        var restaurantFood = new RestaurantFoodEntity
        {
            RestaurantId = restaurant.Id,
            FoodId = newFood.Id
        };
        _context.RestaurantFoods.Add(restaurantFood);

        // Xử lý danh sách tên category
        if (dto.CategoryNames != null && dto.CategoryNames.Any())
        {
            foreach (var categoryName in dto.CategoryNames)
            {
                // Tìm category theo tên
                var existingCategory = await _context.FoodCategories
                    .FirstOrDefaultAsync(c => c.Name.ToLower() == categoryName.Trim().ToLower());

                int categoryId;

                // Nếu category không tồn tại, tạo mới
                if (existingCategory == null)
                {
                    var newCategory = new FoodCategoryEntity
                    {
                        Name = categoryName.Trim()
                    };
                    _context.FoodCategories.Add(newCategory);
                    await _context.SaveChangesAsync();
                    categoryId = newCategory.Id;
                }
                else
                {
                    categoryId = existingCategory.Id;
                }

                // Thêm liên kết giữa món ăn và category
                var foodCategoryItem = new FoodCategoryItemEntity
                {
                    CategoryId = categoryId,
                    FoodId = newFood.Id
                };
                _context.FoodCategoryItems.Add(foodCategoryItem);
            }
        }

        await _context.SaveChangesAsync();

        var responseDto = new FoodBriefResponse
        {
            Id = newFood.Id,
            Content = newFood.Content,
            Description = newFood.Description,
            Price = newFood.Price,
            ImageUrl = newFood.ImageUrl,
            IsVegetarian = newFood.IsVegetarian,
            CreatedAt = newFood.CreatedAt
        };

        return new BaseAPIResponse
        {
            IsSuccess = true,
            StatusCode = (int)HttpStatusCode.Created,
            Message = "Tạo món ăn thành công.",
            Data = responseDto
        };
    }


    public async Task<BaseAPIResponse> UpdateFoodAsync(int userId, int foodId, FoodUpdateRequest dto)
    {
        var food = await _foodRepository.GetFoodByIdAsync(foodId);

        if (food is null)
        {
            return new BaseAPIResponse
            {
                IsSuccess = false,
                StatusCode = (int)HttpStatusCode.NotFound,
                Message = "Không tìm thấy món ăn."
            };
        }

        // Kiểm tra xem người dùng có sở hữu bất kỳ nhà hàng nào mà món ăn này thuộc về không.
        var userOwnsFood = await _context.RestaurantFoods
            .AnyAsync(rf => rf.FoodId == foodId && rf.Restaurant.UserId == userId);

        if (!userOwnsFood)
        {
            return new BaseAPIResponse
            {
                IsSuccess = false,
                StatusCode = (int)HttpStatusCode.Forbidden,
                Message = "Bạn không có quyền chỉnh sửa món ăn này."
            };
        }

        if (!string.IsNullOrEmpty(dto.Content)) food.Content = dto.Content;
        if (!string.IsNullOrEmpty(dto.Description)) food.Description = dto.Description;
        if (dto.Price.HasValue) food.Price = dto.Price.Value;

        if (dto.ImageUrl != null)
        {
            string newImageUrl = await _photoService.UploadPhotoAsync(dto.ImageUrl);
            food.ImageUrl = newImageUrl;
        }

        if (dto.IsVegetarian.HasValue) food.IsVegetarian = dto.IsVegetarian.Value;

        // Xóa các liên kết category cũ
        var existingCategories = _context.FoodCategoryItems.Where(fci => fci.FoodId == foodId);
        _context.FoodCategoryItems.RemoveRange(existingCategories);
        await _context.SaveChangesAsync();

        // Xử lý và thêm các liên kết category mới
        if (dto.CategoryNames != null && dto.CategoryNames.Any())
        {
            foreach (var categoryName in dto.CategoryNames)
            {
                var existingCategory = await _context.FoodCategories
                    .FirstOrDefaultAsync(c => c.Name.ToLower() == categoryName.Trim().ToLower());

                int categoryId;

                if (existingCategory == null)
                {
                    var newCategory = new FoodCategoryEntity
                    {
                        Name = categoryName.Trim()
                    };
                    _context.FoodCategories.Add(newCategory);
                    await _context.SaveChangesAsync();
                    categoryId = newCategory.Id;
                }
                else
                {
                    categoryId = existingCategory.Id;
                }

                var foodCategoryItem = new FoodCategoryItemEntity
                {
                    CategoryId = categoryId,
                    FoodId = foodId
                };
                _context.FoodCategoryItems.Add(foodCategoryItem);
            }
        }

        if (!await _foodRepository.UpdateFoodAsync(food))
        {
            return new BaseAPIResponse
            {
                IsSuccess = false,
                StatusCode = (int)HttpStatusCode.InternalServerError,
                Message = "Không thể cập nhật món ăn."
            };
        }

        await _context.SaveChangesAsync();

        var responseDto = new FoodBriefResponse
        {
            Id = food.Id,
            Content = food.Content,
            Description = food.Description,
            Price = food.Price,
            ImageUrl = food.ImageUrl ?? string.Empty,
            IsVegetarian = food.IsVegetarian,
            CreatedAt = food.CreatedAt
        };

        return new BaseAPIResponse
        {
            IsSuccess = true,
            StatusCode = (int)HttpStatusCode.OK,
            Message = "Cập nhật món ăn thành công.",
            Data = responseDto
        };
    }
public async Task<BaseAPIResponse> DeleteFoodsAsync(int userId, int foodId)
    {
        var food = await _foodRepository.GetFoodByIdAsync(foodId);

        if (food is null)
        {
            return new BaseAPIResponse
            {
                IsSuccess = false,
                StatusCode = (int)HttpStatusCode.NotFound,
                Message = "Không tìm thấy món ăn."
            };
        }

        // Kiểm tra xem người dùng có sở hữu bất kỳ nhà hàng nào mà món ăn này thuộc về không.
        var userOwnsFood = await _context.RestaurantFoods
            .AnyAsync(rf => rf.FoodId == foodId && rf.Restaurant.UserId == userId);

        if (!userOwnsFood)
        {
            return new BaseAPIResponse
            {
                IsSuccess = false,
                StatusCode = (int)HttpStatusCode.Forbidden,
                Message = "Bạn không có quyền xóa món ăn này."
            };
        }

        // Xóa tất cả các liên kết liên quan đến món ăn trước khi xóa món ăn
        var relatedCategoryItems = _context.FoodCategoryItems.Where(fci => fci.FoodId == foodId);
        _context.FoodCategoryItems.RemoveRange(relatedCategoryItems);

        var relatedRestaurantFoods = _context.RestaurantFoods.Where(rf => rf.FoodId == foodId);
        _context.RestaurantFoods.RemoveRange(relatedRestaurantFoods);

        await _context.SaveChangesAsync();

        if (!await _foodRepository.DeleteFoodAsync(food))
        {
            return new BaseAPIResponse
            {
                IsSuccess = false,
                StatusCode = (int)HttpStatusCode.InternalServerError,
                Message = "Không thể xóa món ăn."
            };
        }

        return new BaseAPIResponse
        {
            IsSuccess = true,
            StatusCode = (int)HttpStatusCode.NoContent,
            Message = "Xóa món ăn thành công."
        };
    }
    public async Task<List<FoodResponse>> GetFoodsByNameAsync(string? foodName)
    {
        var foods = await _foodRepository.GetFoodsByNameAsync(foodName);
        var foodIds = foods.Select(f => f.Id).ToList();

        // Truy vấn số lượt xem
        var views = await _context.FoodViews
            .Where(v => foodIds.Contains(v.Food_id))
            .GroupBy(v => v.Food_id)
            .Select(g => new { FoodId = g.Key, ViewCount = g.Count() })
            .ToDictionaryAsync(g => g.FoodId, g => g.ViewCount);

        // Truy vấn đánh giá trung bình
        var ratings = await _context.FeedbackEntitys
            .Where(f => foodIds.Contains(f.Food_id))
            .GroupBy(f => f.Food_id)
            .Select(g => new { FoodId = g.Key, AvgRating = g.Average(f => f.Rating) })
            .ToDictionaryAsync(g => g.FoodId, g => g.AvgRating);

        var result = foods.Select(f => new FoodResponse
        {
            Id = f.Id,
            Content = f.Content,
            Description = f.Description,
            ImageUrl = f.ImageUrl ?? string.Empty,
            IsVegetarian = f.IsVegetarian,
            Address = f.Address,
            TotalViews = views.ContainsKey(f.Id) ? views[f.Id] : 0,
            AverageRating = ratings.ContainsKey(f.Id) ? Math.Round(ratings[f.Id], 2) : 0,
            Price = f.Price
        }).ToList();

        return result;
    }
}