using Microsoft.AspNetCore.Mvc;
using Eatzie.DTOs.Request;
using Eatzie.Helpers;
using System.Linq;
using Eatzie.Interfaces.IService;

namespace Eatzie.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class AuthController(ISignUpService signupService, ILogger<AuthController> logger) : ControllerBase
    {
        private readonly ISignUpService _signupService = signupService;
        private readonly ILogger<AuthController> _logger = logger;

        [HttpPost("signup")]
        public async Task<IActionResult> SignUp([FromBody] SignUpRequest signUpRequest)
        {
            if (!ModelState.IsValid)
            {
                var errorFields = ModelState.Keys
                    .SelectMany(key => ModelState[key]!.Errors.Select(x => new ErrorField
                    {
                        FieldName = key,
                        ErrorMessage = x.ErrorMessage
                    })).ToList();

                var errorResponse = new ErrorResponse(
                    statusCode: StatusCodes.Status400BadRequest,
                    message: "Dữ liệu đầu vào không hợp lệ.",
                    errorFields: errorFields
                );
                return BadRequest(errorResponse);
            }

            try
            {
                var (succeeded, errorMessage) = await _signupService.SignUpAsync(signUpRequest);

                if (succeeded)
                {
                    var successResponse = new BaseAPIResponse("Đăng ký tài khoản thành công.", StatusCodes.Status200OK, true);
                    return Ok(successResponse);
                }

                var conflictResponse = new BaseAPIResponse(errorMessage ?? "Email đã tồn tại.", StatusCodes.Status409Conflict, false);
                return Conflict(conflictResponse);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Đã xảy ra lỗi trong quá trình đăng ký.");
                var serverErrorResponse = new BaseAPIResponse("Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.", StatusCodes.Status500InternalServerError, false);
                return StatusCode(StatusCodes.Status500InternalServerError, serverErrorResponse);
            }
        }
    }
}