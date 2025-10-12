using Eatzie.Data;
using Eatzie.DTOs.Request;
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

        public async Task<BaseAPIResponse> CreateOrderAsync(int userId,CreateOrderRequest request, int OrderId)
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
                Note = request.Note
            }).ToList();

            var newOrder = new OrderEntity
            {
                UserId = userId,
                Id = OrderId,
                CreatedAt = DateTime.UtcNow,
                Status = "Chờ xác nhận",
                TotalAmount = request.TotalPrice,
                OrderDetails = orderDetails
            };

            var Order = new OrderResponse
            {
                OrderId = OrderId,
                Status = "Chờ xác nhận",
                TotalAmount = request.TotalPrice,
                CreatedAt = DateTime.UtcNow,
                Items = orderDetails.Select(od => new OrderItemResponse
                {
                    FoodId = od.FoodId,
                    Quantity = od.Quantity,
                    Price = (decimal)od.UnitPrice,
                    Note = od.Note,
                    //FoodName = od.Food?.Content ?? string.Empty,
                    //ImageUrl = od.Food?.ImageUrl ?? string.Empty
                }).ToList()
            };

            await _orderRepo.AddOrderAsync(newOrder);
            await _cartRepo.RemoveCartItemsAsync(cartItems);
            await _dbContext.SaveChangesAsync();

            return new BaseAPIResponse
            {
                IsSuccess = true,
                StatusCode = 200,
                Data = Order
            };
        }


        public async Task<List<OrderResponse>> GetOrdersAsync(int userId)
        {
            var orders = await _orderRepo.GetOrdersByUserIdAsync(userId);

            return orders.Select(o => new OrderResponse
            {
                OrderId = o.Id,
                CreatedAt = o.CreatedAt,
                TotalAmount = o.TotalAmount,
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
                TotalAmount = order.TotalAmount,
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