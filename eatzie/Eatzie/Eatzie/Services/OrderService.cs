using Eatzie.Data;
using Eatzie.DTOs.Response;
using Eatzie.Helpers;
using Eatzie.Interfaces.IRepository;
using Eatzie.Interfaces.IService;
using Eatzie.Models;

namespace Eatzie.Services
{
    public class OrderService(
        IOrderRepository orderRepo,
        ICartRepository cartRepo,
        ApplicationDbContext db
    ) : IOrderService
    {
        private readonly IOrderRepository _orderRepo = orderRepo;
        private readonly ICartRepository _cartRepo = cartRepo;
        private readonly ApplicationDbContext _dbContext = db;

        public async Task<BaseAPIResponse> CreateOrderAsync(int userId, decimal totalPrice)
        {
            var cartItems = await _cartRepo.GetCartItemsAsync(userId);
            if (cartItems == null || !cartItems.Any())
            {
                return new BaseAPIResponse("Giỏ hàng đang trống.", 400, false);
            }

            var orderDetails = cartItems.Select(item => new OrderDetailEntity
            {
                FoodId = item.FoodId,
                Quantity = item.Quantity,
                UnitPrice = item.Food!.Price,
                Note = null
            }).ToList();

            var newOrder = new OrderEntity
            {
                UserId = userId,
                CreatedAt = DateTime.UtcNow,
                Status = "Đang xử lý",
                TotalAmount = totalPrice,
                OrderDetails = orderDetails
            };

            await _orderRepo.AddOrderAsync(newOrder);
            await _cartRepo.RemoveCartItemsAsync(cartItems);
            await _dbContext.SaveChangesAsync();

            return new BaseAPIResponse("Tạo đơn hàng thành công.", 201, true);
        }


        public async Task<List<OrderResponse>> GetOrdersAsync(int userId)
        {
            var orders = await _orderRepo.GetOrdersByUserIdAsync(userId);

            return orders.Select(o => new OrderResponse
            {
                OrderId = o.Id,
                CreatedAt = o.CreatedAt,
                TotalAmount = (double)o.TotalAmount,
                Status = o.Status,
                Items = o.OrderDetails.Select(d => new OrderItemResponse
                {
                    FoodId = d.FoodId,
                    FoodName = d.Food?.Content ?? string.Empty,
                    Quantity = d.Quantity,
                    Price = d.UnitPrice,
                    ImageUrl = d.Food?.ImageUrl ?? string.Empty,
                    Note = d.Note
                }).ToList()
            }).ToList();
        }

        public async Task<OrderResponse?> GetOrderDetailAsync(int orderId)
        {
            var order = await _orderRepo.GetOrderByIdAsync(orderId);
            if (order == null) return null;

            return new OrderResponse
            {
                OrderId = order.Id,
                CreatedAt = order.CreatedAt,
                TotalAmount = (double)order.TotalAmount,
                Status = order.Status,
                Items = order.OrderDetails.Select(d => new OrderItemResponse
                {
                    FoodId = d.FoodId,
                    FoodName = d.Food?.Content ?? string.Empty,
                    Quantity = d.Quantity,
                    Price = d.UnitPrice,
                    ImageUrl = d.Food?.ImageUrl ?? string.Empty,
                    Note = d.Note
                }).ToList()
            };
        }
    }
}