using Eatzie.Interfaces.IService;
using Microsoft.AspNetCore.Mvc;

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
    }
}