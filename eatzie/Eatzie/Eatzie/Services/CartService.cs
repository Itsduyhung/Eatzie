using Eatzie.Data;
using Eatzie.DTOs.Request;
using Eatzie.DTOs.Response;
using Eatzie.Helpers;
using Eatzie.Interfaces.IRepository;
using Eatzie.Interfaces.IService;
using Eatzie.Models;

namespace Eatzie.Services
{
    public class CartService(ICartRepository repo, ApplicationDbContext db) : ICartService
    {
        private readonly ICartRepository _repo = repo;
        private readonly ApplicationDbContext _dbContext = db;

        public async Task<BaseAPIResponse> AddToCartAsync(int userId, int foodId, int quantity)
        {
            var food = await _dbContext.Foods.FindAsync(foodId);
            if (food == null)
            {
                return new BaseAPIResponse("Món ăn không tồn tại.", 404, false);
            }

            var existingItem = await _repo.GetCartItemAsync(userId, foodId);

            if (existingItem != null)
            {
                existingItem.Quantity += quantity;
            }
            else
            {
                await _repo.AddCartItemAsync(new CartItemEntity
                {
                    UserId = userId,
                    FoodId = foodId,
                    Quantity = quantity,
                    Food = food
                });
            }

            await _repo.SaveChangesAsync();
            return new BaseAPIResponse("Thêm vào giỏ hàng thành công.", 200, true);
        }

        public async Task<BaseAPIResponse> AddToCartRangeAsync(int userId, List<AddToCartItemRequest> items)
        {
            if (items == null || items.Count == 0)
            {
                return new BaseAPIResponse("Danh sách món ăn trống.", 400, false);
            }

            foreach (var item in items)
            {
                if (item.Quantity <= 0) continue;

                var food = await _dbContext.Foods.FindAsync(item.FoodId);
                if (food == null) continue;

                var existingItem = await _repo.GetCartItemAsync(userId, item.FoodId);
                if (existingItem != null)
                {
                    existingItem.Quantity += item.Quantity;
                }
                else
                {
                    await _repo.AddCartItemAsync(new CartItemEntity
                    {
                        UserId = userId,
                        FoodId = item.FoodId,
                        Quantity = item.Quantity,
                        Food = food
                    });
                }
            }

            await _repo.SaveChangesAsync();
            return new BaseAPIResponse("Thêm nhiều món vào giỏ hàng thành công.", 200, true);
        }

        public async Task<BaseAPIResponse> RemoveFromCartAsync(int userId, int foodId)
        {
            var item = await _repo.GetCartItemAsync(userId, foodId);
            if (item == null) return new BaseAPIResponse("Không tìm thấy sản phẩm.", 404, false);
            await _repo.RemoveCartItemAsync(item);
            await _repo.SaveChangesAsync();
            return new BaseAPIResponse("Xóa món ăn thành công.", 200, true);
        }

        public async Task<BaseAPIResponse> ClearCartAsync(int userId)
        {
            var items = await _repo.GetCartItemsAsync(userId);
            await _repo.RemoveCartItemsAsync(items);
            await _repo.SaveChangesAsync();
            return new BaseAPIResponse("Xóa toàn bộ món ăn trong giỏ hàng thành công.", 200, true);
        }

        public async Task<List<CartItemResponse>> GetCartItemsAsync(int userId)
        {
            var items = await _repo.GetCartItemsAsync(userId);
            return items.Select(i => new CartItemResponse
            {
                FoodId = i.FoodId,
                FoodName = i.Food?.Content ?? string.Empty,
                Quantity = i.Quantity,
                ImageUrl = i.Food?.ImageUrl ?? string.Empty,
                Price = i.Food?.Price ?? 0.0m
            }).ToList();
        }
    }
}