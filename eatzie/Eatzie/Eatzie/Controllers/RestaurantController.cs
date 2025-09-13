using Eatzie.Helpers;
using Eatzie.Interfaces;
using Eatzie.Interfaces.IService;
using Microsoft.AspNetCore.Mvc;

namespace Eatzie.Controllers;

[ApiController]
[Route("api/restaurants")]
public class RestaurantController : ControllerBase
{
    private readonly IRestaurantService _restaurantService;

    public RestaurantController(IRestaurantService restaurantService)
    {
        _restaurantService = restaurantService;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetRestaurantDetails(int id)
    {
        var response = await _restaurantService.GetRestaurantDetailsAsync(id);

        if (response.IsSuccess)
        {
            return Ok(response);
        }

        return StatusCode(response.StatusCode, response);
    }
}