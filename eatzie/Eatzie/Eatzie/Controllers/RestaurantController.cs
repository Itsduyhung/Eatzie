using Eatzie.DTOs.Request;
using Eatzie.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Eatzie.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RestaurantController : ControllerBase
{
    private readonly IRestaurantService _restaurantService;

    public RestaurantController(IRestaurantService restaurantService)
    {
        _restaurantService = restaurantService;
    }

    [HttpPost]
    [Authorize]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> CreateRestaurant([FromForm] RestaurantRequest requestDto)
    {
        // Lấy userId từ token JWT
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdString, out int userId))
        {
            return Unauthorized(new BaseAPIResponse
            {
                IsSuccess = false,
                Message = "Không thể xác định người dùng."
            });
        }

        var response = await _restaurantService.CreateRestaurantAsync(userId, requestDto);
        return StatusCode(response.StatusCode, response);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetRestaurantById(int id)
    {
        var response = await _restaurantService.GetRestaurantByIdAsync(id);
        if (!response.IsSuccess)
        {
            return NotFound(response);
        }
        return Ok(response);
    }

    [HttpGet]
    public async Task<IActionResult> GetAllRestaurants()
    {
        var response = await _restaurantService.GetAllRestaurantsAsync();
        return Ok(response);
    }

    [HttpPut("{id}")]
    [Authorize]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UpdateRestaurant(int id, [FromForm] RestaurantRequest requestDto)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdString, out int userId))
        {
            return Unauthorized(new BaseAPIResponse
            {
                IsSuccess = false,
                Message = "Không thể xác định người dùng."
            });
        }

        var response = await _restaurantService.UpdateRestaurantAsync(userId, id, requestDto);
        if (!response.IsSuccess && response.StatusCode == 404)
        {
            return NotFound(response);
        }
        if (!response.IsSuccess && response.StatusCode == 403)
        {
            return Forbid();
        }
        return StatusCode(response.StatusCode, response);
    }
    [HttpGet("foods")]
    public async Task<IActionResult> GetFoodsByRestaurantId([FromQuery] int restaurantId)
    {
        var response = await _restaurantService.GetAllFoodRestaurantsByIdAsync(restaurantId);
        return Ok(response);
    }

    [HttpGet("has")]
    public async Task<IActionResult> UserHasRestaurant([FromQuery] int userId)
    {
        var response = await _restaurantService.UserHasRestaurantAsync(userId);
        return StatusCode(response.StatusCode, response);
    }

    //[HttpDelete("{id}")]
    //[Authorize]
    //public async Task<IActionResult> DeleteRestaurant(int id)
    //{
    //    var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
    //    if (!int.TryParse(userIdString, out int userId))
    //    {
    //        return Unauthorized(new BaseAPIResponse
    //        {
    //            IsSuccess = false,
    //            Message = "Không thể xác định người dùng."
    //        });
    //    }

    //    var response = await _restaurantService.DeleteRestaurantAsync(userId, id);
    //    if (!response.IsSuccess && response.StatusCode == 404)
    //    {
    //        return NotFound(response);
    //    }
    //    if (!response.IsSuccess && response.StatusCode == 403)
    //    {
    //        return Forbid();
    //    }
    //    return StatusCode(response.StatusCode, response);
    //}
}