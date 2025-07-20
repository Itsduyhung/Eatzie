using Eatzie.Data;
using Eatzie.DTOs.Request;
using Eatzie.Helpers;
using Eatzie.Interfaces.IService;
using Eatzie.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Eatzie.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OrderController(IOrderService service, ApplicationDbContext context) : ControllerBase
    {
        private readonly IOrderService _service = service;
        private readonly ApplicationDbContext _context = context;
        [HttpPost("create")]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request)
        {
            var userId = GetUserIdFromToken.ExtractUserId(HttpContext);
            if (userId == null) return Unauthorized();

            var result = await _service.CreateOrderAsync(userId.Value, request.TotalPrice);
            return StatusCode(result.StatusCode, result);
        }
        [HttpPatch("{orderId}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int orderId, [FromBody] OrderStatusRequest request)
        {
            var order = await _context.Orders.FindAsync(orderId);
            if (order == null)
            {
                return NotFound(new { message = "Không tìm thấy đơn hàng." });
            }

            var allowedStatuses = new[] { "Đã nhận hàng", "Hủy" };
            if (!allowedStatuses.Contains(request.NewStatus))
            {
                return BadRequest(new { message = "Trạng thái không hợp lệ." });
            }

            order.Status = request.NewStatus;
            //order.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Cập nhật trạng thái đơn hàng thành công." });
        }

        // GET: /api/order
        [HttpGet]
        public async Task<IActionResult> GetOrders()
        {
            var userId = GetUserIdFromToken.ExtractUserId(HttpContext);
            if (userId == null) return Unauthorized();

            var orders = await _service.GetOrdersAsync(userId.Value);
            return Ok(orders);
        }

        // GET: /api/order/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderDetail(int id)
        {
            var result = await _service.GetOrderDetailAsync(id);
            if (result == null) return NotFound("Order not found");
            return Ok(result);
        }
    }
}