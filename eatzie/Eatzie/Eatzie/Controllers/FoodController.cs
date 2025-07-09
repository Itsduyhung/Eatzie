using Eatzie.Interfaces.IService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Eatzie.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FoodController : ControllerBase
    {
        private readonly IFoodService _service;

        public FoodController(IFoodService service)
        {
            _service = service;
        }

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
    }
}