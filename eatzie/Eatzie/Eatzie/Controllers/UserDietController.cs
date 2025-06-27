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
        public async Task<IActionResult> CreateUserDiet([FromBody] DietTypeRequest request)
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
        [HttpPost("favorite-food")]
        public async Task<IActionResult> UpdateFavoriteFood([FromBody] FavoriteFoodRequest request)
        {
            try
            {
                var result = await _userDietService.UpdateFavoriteFoodAsync(request);
                return Ok(new BaseAPIResponse("Update favorite food success", 200, true));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ErrorResponse(500, ex.Message));
            }
        }
        /// <summary>
        /// API for budget for user input
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost("spending-range")]
        public async Task<IActionResult> UpdateSpending([FromBody] SpendingRequest request)
        {
            try
            {
                var result = await _userDietService.UpdateSpendingAsync(request);
                return Ok(new BaseAPIResponse("Update spending range success", 200, true));
            }
            catch (Exception ex)
            {
                var message = ex.InnerException != null
                    ? $"{ex.Message} - Inner: {ex.InnerException.Message}"
                    : ex.Message;

                return StatusCode(500, new ErrorResponse(500, message));
            }
        }
        /// <summary>
        /// API GET data from userdiet
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUserDiet(int userId)
        {
            try
            {
                var result = await _userDietService.GetUserDietByUserIdAsync(userId);
                if (result == null)
                    return NotFound(new ErrorResponse(404, "UserDiet not found"));

                return Ok(new BaseAPIResponse<object>
                {
                    Message = "Success",
                    StatusCode = 200,
                    IsSuccess = true,
                    Data = result
                });
            }
            catch (Exception ex)
            {
                var msg = ex.InnerException?.Message ?? ex.Message;
                return StatusCode(500, new ErrorResponse(500, msg));
            }
        }
        /// <summary>
        /// API PUT fot edit data for user
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPut("update-full")]
        public async Task<IActionResult> UpdateUserDiet([FromBody] UserDietRequest request)
        {
            try
            {
                var result = await _userDietService.UpdateUserDietAsync(request);

                return Ok(new BaseAPIResponse<object>
                {
                    Message = "Update success",
                    StatusCode = 200,
                    IsSuccess = true,
                    Data = result
                });
            }
            catch (Exception ex)
            {
                var msg = ex.InnerException?.Message ?? ex.Message;
                return StatusCode(500, new ErrorResponse(500, msg));
            }
        }

    }
}