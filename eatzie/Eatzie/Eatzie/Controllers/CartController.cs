using Eatzie.DTOs.Request;
using Eatzie.Helpers;
using Eatzie.Interfaces.IService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Eatzie.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CartController(ICartService service) : ControllerBase
    {
        private readonly ICartService _service = service;

        [HttpPost("add")]
        public async Task<IActionResult> AddToCart([FromBody] AddToCartRequest request)
        {
            var userId = GetUserIdFromToken.ExtractUserId(HttpContext);
            if (userId == null) return Unauthorized();

            var result = await _service.AddToCartAsync(userId.Value, request.FoodId, request.Quantity);
            return StatusCode(result.StatusCode, result);
        }

        [HttpDelete("remove/{foodId}")]
        public async Task<IActionResult> RemoveFromCart(int foodId)
        {
            var userId = GetUserIdFromToken.ExtractUserId(HttpContext);
            if (userId == null) return Unauthorized();
            var result = await _service.RemoveFromCartAsync(userId.Value, foodId);
            return StatusCode(result.StatusCode, result);
        }

        [HttpDelete("clear")]
        public async Task<IActionResult> ClearCart()
        {
            var userId = GetUserIdFromToken.ExtractUserId(HttpContext);
            if (userId == null) return Unauthorized();
            var result = await _service.ClearCartAsync(userId.Value);
            return StatusCode(result.StatusCode, result);
        }

        [HttpGet]
        public async Task<IActionResult> GetCart()
        {
            var userId = GetUserIdFromToken.ExtractUserId(HttpContext);
            if (userId == null) return Unauthorized();
            var items = await _service.GetCartItemsAsync(userId.Value);
            return Ok(items);
        }
    }
}