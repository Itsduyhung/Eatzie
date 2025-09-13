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
    public class FoodController(IFoodService service) : ControllerBase
    {
        private readonly IFoodService _service = service;

        [HttpGet("suggest")]
        public async Task<IActionResult> SuggestFoods([FromQuery] int userId)
        {
            var result = await _service.SuggestFoodsAsync(userId);
            return Ok(result);
        }

        [HttpGet("history")]
        public async Task<IActionResult> GetHistoryFoods([FromQuery] int userId)
        {
            var result = await _service.GetAllHistoryFoodsAsync(userId);
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
            if (userId == null) return Unauthorized("Token không hợp lệ.");

            var deviceInfo = Request.Headers["User-Agent"].ToString();

            await _service.AddFoodViewAsync(userId, foodId, deviceInfo);
            return Ok(new { message = "View has been counted." });
        }

        [HttpPost("{foodId}/feedback")]
        public async Task<IActionResult> AddFeedback(int foodId, [FromBody] FeedbackRequest request)
        {
            if (foodId != request.Food_id)
                return BadRequest("FoodId mismatch between URL and body.");

            var userId = GetUserIdFromToken.ExtractUserId(HttpContext);
            if (userId == null) return Unauthorized("Token không hợp lệ.");

            request.UserId = userId.Value;

            await _service.CreateFeedbackAsync(request);
            return Ok(new { message = "Thêm Feedback thành công." });
        }
        [HttpGet("{foodId}/feedbacks")]
        public async Task<IActionResult> GetFeedbacks(int foodId)
        {
            var feedbacks = await _service.GetFeedbacksByFoodIdAsync(foodId);
            return Ok(feedbacks);
        }
        [HttpPut("feedback/{feedbackId}")]
        public async Task<IActionResult> UpdateFeedback(int feedbackId, [FromBody] FeedbackRequest request)
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