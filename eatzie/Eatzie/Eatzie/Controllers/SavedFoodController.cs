using Eatzie.DTOs.Request;
using Eatzie.Helpers;
using Eatzie.Interfaces.IService;
using Eatzie.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Eatzie.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SavedFoodController(ISavedFoodService savedFoodService) : ControllerBase
    {
        private readonly ISavedFoodService _savedFoodService = savedFoodService;

        [HttpPost]
        public async Task<IActionResult> SaveFood([FromBody] SavedFoodRequest request)
        {
            var userId = GetUserIdFromToken.ExtractUserId(HttpContext);
            if (userId == null)
                return Unauthorized(new ErrorResponse(401, "Token không hợp lệ."));

            var result = await _savedFoodService.SaveFoodAsync(userId.Value, request);
            return StatusCode(result.StatusCode, result);
        }

        [HttpDelete("{foodId}")]
        public async Task<IActionResult> RemoveSavedFood(int foodId)
        {
            var userId = GetUserIdFromToken.ExtractUserId(HttpContext);
            if (userId == null)
                return Unauthorized(new ErrorResponse(401, "Token không hợp lệ."));

            var result = await _savedFoodService.RemoveSavedFoodAsync(userId.Value, foodId);
            return StatusCode(result.StatusCode, result);
        }

        [HttpGet]
        public async Task<IActionResult> GetSavedFoods()
        {
            var userId = GetUserIdFromToken.ExtractUserId(HttpContext);
            if (userId == null)
                return Unauthorized(new ErrorResponse(401, "Token không hợp lệ."));

            var data = await _savedFoodService.GetSavedFoodsAsync(userId.Value);
            return Ok(data);
        }
    }
}