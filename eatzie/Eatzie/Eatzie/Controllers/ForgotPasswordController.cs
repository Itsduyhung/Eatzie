using Eatzie.DTOs.Request;
using Eatzie.Helpers;
using Eatzie.Interfaces.IService;
using Microsoft.AspNetCore.Mvc;
using Eatzie.DTOs.Response;
using System.Threading.Tasks;

namespace Eatzie.Controllers
{
    [ApiController]
    [Route("api/password")]
    public class ForgotPasswordController : ControllerBase
    {
        private readonly IForgotPasswordService _forgotPasswordService;
        private readonly ILogger<ForgotPasswordController> _logger;

        public ForgotPasswordController(IForgotPasswordService forgotPasswordService, ILogger<ForgotPasswordController> logger)
        {
            _forgotPasswordService = forgotPasswordService;
            _logger = logger;
        }

        [HttpPost("forgot")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ErrorResponse(400, "Dữ liệu không hợp lệ.", ModelState.SelectMany(x => x.Value.Errors).Select(e => new ErrorField { ErrorMessage = e.ErrorMessage }).ToList()));
            }

            try
            {
                await _forgotPasswordService.ForgotPasswordAsync(request.Email);
                var response = new BaseAPIResponse(
                    "Nếu tài khoản với email này tồn tại, một mã OTP đã được gửi đến.",
                    StatusCodes.Status200OK,
                    true
                );
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi trong quy trình quên mật khẩu cho email: {Email}", request.Email);
                var serverErrorResponse = new BaseAPIResponse("Lỗi hệ thống.", 500, false);
                return StatusCode(500, serverErrorResponse);
            }
        }

        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ErrorResponse(400, "Dữ liệu không hợp lệ.", ModelState.SelectMany(x => x.Value.Errors).Select(e => new ErrorField { ErrorMessage = e.ErrorMessage }).ToList()));
            }

            try
            {
                var resetToken = await _forgotPasswordService.VerifyOtpAsync(request);

                if (string.IsNullOrEmpty(resetToken))
                {
                    return BadRequest(new BaseAPIResponse("OTP không hợp lệ hoặc đã hết hạn.", 400, false));
                }

                return Ok(new VerifyOtpResponse { ResetToken = resetToken });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi xác thực OTP cho email: {Email}", request.Email);
                return StatusCode(500, new BaseAPIResponse("Lỗi hệ thống.", 500, false));
            }
        }

        [HttpPost("set-new-password")]
        public async Task<IActionResult> SetNewPassword([FromBody] ResetPasswordRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ErrorResponse(400, "Dữ liệu không hợp lệ.", ModelState.SelectMany(x => x.Value.Errors).Select(e => new ErrorField { ErrorMessage = e.ErrorMessage }).ToList()));
            }

            try
            {
                var (succeeded, message) = await _forgotPasswordService.SetNewPasswordAsync(request);

                if (!succeeded)
                {
                    return BadRequest(new BaseAPIResponse(message, 400, false));
                }

                return Ok(new BaseAPIResponse(message, 200, true));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi đặt lại mật khẩu bằng token.");
                return StatusCode(500, new BaseAPIResponse("Lỗi hệ thống.", 500, false));
            }
        }
    }
}