using Eatzie.Data;
using Eatzie.DTOs.Response;
using Eatzie.Helpers;
using Eatzie.Interfaces.IRepository;
using Eatzie.Interfaces.IService;
using
Eatzie.Models;

namespace Eatzie.Services
{
    public class CartService(ICartRepository repo, ApplicationDbContext db) : ICartService
    {
        private readonly ICartRepository _repo = repo;
        private readonly ApplicationDbContext _dbContext = db;

        public async Task<BaseAPIResponse> AddToCartAsync(int userId, int foodId, int quantity)
        {
            var existingItem = await _repo.GetCartItemAsync(userId, foodId);

            if (existingItem != null)
                existingItem.Quantity += quantity;
            else
                await _repo.AddCartItemAsync(new CartItemEntity { UserId = userId, FoodId = foodId, Quantity = quantity });

            await _repo.SaveChangesAsync();
            return new BaseAPIResponse("Thêm vào giỏ hàng thành công.", 200, true);
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

        //public async Task<BaseAPIResponse> PlaceOrderAsync(int userId)
        //{
        //    var cartItems = await _repo.GetCartItemsAsync(userId);
        //    if (!cartItems.Any()) return new BaseAPIResponse("Không tìm thấy sản phẩm nào.", 400, false);

        //    var order = new OrderEntity
        //    {
        //        UserId = userId,
        //        CreatedAt = DateTime.UtcNow,
        //        Status = "Pending",
        //        TotalAmount = cartItems.Sum(c => c.Quantity * 10),
        //        OrderDetails = cartItems.Select(c => new OrderDetailEntity
        //        {
        //            FoodId = c.FoodId,
        //            Quantity = c.Quantity,
        //            UnitPrice = 10
        //        }).ToList()
        //    };

        //    _dbContext.Orders.Add(order);
        //    await _repo.RemoveCartItemsAsync(cartItems);
        //    await _repo.SaveChangesAsync();
        //    return new BaseAPIResponse("Đơn hàng đã được đặt thành công.", 200, true);
        //}

        public async Task<List<CartItemResponse>> GetCartItemsAsync(int userId)
        {
            var items = await _repo.GetCartItemsAsync(userId);
            return items.Select(i => new CartItemResponse
            {
                FoodId = i.FoodId,
                FoodName = i.Food?.Content ?? string.Empty,
                Quantity = i.Quantity,
                ImageUrl = i.Food?.ImageUrl
            }).ToList();
        }
    }
}