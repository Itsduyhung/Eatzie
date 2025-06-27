using Eatzie.DTOs.Request;
using Eatzie.Helpers;
using Eatzie.Interfaces.IService;
using Microsoft.AspNetCore.Mvc;

namespace Eatzie.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserDietController(IUserDietService userDietService) : ControllerBase
    {
        private readonly IUserDietService _userDietService = userDietService;

        [HttpPost]
        public async Task<IActionResult> CreateUserDiet([FromBody] UserDietRequest request)
        {
            if (!ModelState.IsValid)
            {
                var errorFields = ModelState
                    .Where(ms => ms.Value.Errors.Count > 0)
                    .Select(ms => new ErrorField
                    {
                        FieldName = ms.Key,
                        ErrorMessage = ms.Value.Errors.First().ErrorMessage
                    }).ToList();

                return BadRequest(new ErrorResponse(400, "Validation failed.", errorFields));
            }

            try
            {
                var result = await _userDietService.CreateUserDietAsync(request);

                return Ok(new BaseAPIResponse<object>
                {
                    Message = "User diet created successfully.",
                    StatusCode = 200,
                    IsSuccess = true,
                    Data = new
                    {
                        result.UserDietId,
                        result.UserId,
                        DietType = result.Diet_type.ToString()
                    }
                });
            }
            catch (Exception ex)
            {
                var detailedMessage = ex.InnerException?.Message ?? ex.Message;

                return StatusCode(500, new ErrorResponse(
                    statusCode: 500,
                    message: "Internal server error: " + detailedMessage
                ));
            }
        }

        [HttpPost("allergic-food")]
        public async Task<IActionResult> UpdateAllergicFood([FromBody] AllergicFoodRequest request)
        {
            if (!ModelState.IsValid)
            {
                var errorFields = ModelState
                    .Where(ms => ms.Value.Errors.Count > 0)
                    .Select(ms => new ErrorField
                    {
                        FieldName = ms.Key,
                        ErrorMessage = ms.Value.Errors.First().ErrorMessage
                    }).ToList();

                return BadRequest(new ErrorResponse(400, "Validation failed.", errorFields));
            }

            try
            {
                var result = await _userDietService.UpdateAllergicFoodAsync(request);

                return Ok(new BaseAPIResponse<object>
                {
                    Message = "Allergic food updated successfully.",
                    StatusCode = 200,
                    IsSuccess = true,
                    Data = new
                    {
                        result.UserId,
                        result.Allergic_food
                    }
                });
            }
            catch (Exception ex)
            {
                var detail = ex.InnerException?.Message ?? ex.Message;
                return StatusCode(500, new ErrorResponse(500, "Internal server error: " + detail));
            }
        }

    }
}