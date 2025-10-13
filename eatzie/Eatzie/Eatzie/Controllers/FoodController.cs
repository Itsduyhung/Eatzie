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
    [ApiController]
    [Route("api/[controller]")]
    public class FoodController(IFoodService service, ApplicationDbContext context) : ControllerBase
    {
        private readonly IFoodService _service = service;
        private readonly ApplicationDbContext _context = context;

        [HttpGet("suggest")]
        public async Task<IActionResult> SuggestFoods()
        {
            var userId = GetUserIdFromToken.ExtractUserId(HttpContext);
            if (userId == null) return Unauthorized("Token không hợp lệ.");

            var result = await _service.SuggestFoodsAsync(userId.Value);
            return Ok(result);
        }

        [HttpGet("history")]
        public async Task<IActionResult> GetHistoryFoods()
        {
            var userId = GetUserIdFromToken.ExtractUserId(HttpContext);
            if (userId == null) return Unauthorized("Token không hợp lệ.");

            var result = await _service.GetAllHistoryFoodsAsync(userId.Value);
            return Ok(result);
        }

        [HttpGet("history/{foodId}")]
        public async Task<IActionResult> GetFoodHistoryDetail(int foodId)
        {
            var result = await _service.GetFoodDetailAsync(foodId);
            if (result == null)
                return NotFound($"Không tìm thấy món ăn với ID: {foodId}");
            return Ok(result);
        }

        [HttpPost("{foodId}/view")]
        public async Task<IActionResult> AddFoodView(int foodId)
        {
            var userId = GetUserIdFromToken.ExtractUserId(HttpContext);
            if (userId == null)
            {
                return StatusCode(401, new BaseAPIResponse("Token không hợp lệ.", 401, false));
            }

            var deviceInfo = Request.Headers["User-Agent"].ToString();

            var response = await _service.AddFoodViewAsync(userId, foodId, deviceInfo);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost("{foodId}/feedback")]
        public async Task<IActionResult> AddFeedback(int foodId, [FromForm] FeedbackRequest request)
        {
            var userId = GetUserIdFromToken.ExtractUserId(HttpContext);
            if (userId == null)
            {
                return StatusCode(401, new BaseAPIResponse("Token không hợp lệ.", 401, false));
            }
            int FeedbackId = _context.FeedbackEntitys.OrderByDescending(o => o.Id).Select(o => o.Id).FirstOrDefault() + 1;
            var response = await _service.CreateFeedbackAsync(userId.Value, foodId, request, FeedbackId);
            return StatusCode(response.StatusCode, response);
        }
        [HttpGet("{foodId}/feedbacks")]
        public async Task<IActionResult> GetFeedbacks(int foodId)
        {
            var feedbacks = await _service.GetFeedbacksByFoodIdAsync(foodId);
            return Ok(feedbacks);
        }
        [HttpPut("feedback/{feedbackId}")]
        public async Task<IActionResult> UpdateFeedback(int feedbackId, [FromForm] FeedbackRequest request)
        {
            var userId = GetUserIdFromToken.ExtractUserId(HttpContext);
            if (userId == null) return Unauthorized("Token không hợp lệ.");

            var result = await _service.UpdateFeedbackAsync(feedbackId, userId.Value, request);
            if (!result) return Forbid("Bạn không được phép sửa feedback này.");

            return Ok(new { message = "Feedback cập nhật thành công." });
        }
        [HttpDelete("feedback/{feedbackId}")]
        public async Task<IActionResult> DeleteFeedback(int feedbackId)
        {
            var userId = GetUserIdFromToken.ExtractUserId(HttpContext);
            if (userId == null) return Unauthorized("Token không hợp lệ.");

            var result = await _service.DeleteFeedbackAsync(feedbackId, userId.Value);
            if (!result) return Forbid("Bạn không được phép xóa feedback này.");

            return Ok(new { message = "Feedback xóa thành công." });
        }

        /// <summary>
        /// CRUD Food for Restaurant
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetFoodDetails(int id)
        {
            var response = await _service.GetFoodDetailsAsync(id);

            if (response.IsSuccess)
            {
                return Ok(response);
            }

            return StatusCode(response.StatusCode, response);
        }
        [HttpGet("search")]
        public async Task<IActionResult> GetFoodsByName([FromQuery] string? foodName)
        {
            var foods = await _service.GetFoodsByNameAsync(foodName);
            return Ok(foods);
        }

        [HttpGet("by-category")]
        public async Task<IActionResult> GetFoodsByCategory([FromQuery] int restaurantId, [FromQuery] int categoryId)
        {
            var response = await _service.GetFoodsByCategoryAsync(restaurantId, categoryId);
            return StatusCode(response.StatusCode, response);
        }

        [Authorize]
        [HttpPost("{restaurantId}")]
        public async Task<IActionResult> CreateFood(int restaurantId, [FromForm] FoodCreateRequest dto)
        {
            var userId = GetUserIdFromToken.ExtractUserId(HttpContext);

            if (userId == null)
            {
                return Unauthorized();
            }

            var response = await _service.CreateFoodAsync(userId.Value, restaurantId, dto);

            if (response.IsSuccess)
            {
                return StatusCode(response.StatusCode, response);
            }

            return StatusCode(response.StatusCode, response);
        }

        [Authorize]
        [HttpPut("{foodId}")]
        public async Task<IActionResult> UpdateFood(int foodId, [FromForm] FoodUpdateRequest dto)
        {
            var userId = GetUserIdFromToken.ExtractUserId(HttpContext);

            if (userId == null)
            {
                return Unauthorized();
            }

            var response = await _service.UpdateFoodAsync(userId.Value, foodId, dto);

            if (response.IsSuccess)
            {
                return Ok(response);
            }

            return StatusCode(response.StatusCode, response);
        }

        [Authorize]
        [HttpDelete("{foodId}")]
        public async Task<IActionResult> DeletesFood(int foodId)
        {
            var userId = GetUserIdFromToken.ExtractUserId(HttpContext);

            if (userId == null)
            {
                return Unauthorized();
            }

            var response = await _service.DeleteFoodsAsync(userId.Value, foodId);

            if (response.IsSuccess)
            {
                return Ok(response);
            }

            return StatusCode(response.StatusCode, response);
        }
    }
}