using Eatzie.Helpers;
using Eatzie.Interfaces.IService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Eatzie.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        [HttpGet("read/{userId}")]
        public async Task<IActionResult> GetReadNotifications(int userId)
        {
            try
            {
                var notifications = await _notificationService.GetReadNotificationsByUserIdAsync(userId);
                return Ok(new BaseAPIResponse<object>
                {
                    Message = "Success",
                    StatusCode = 200,
                    IsSuccess = true,
                    Data = notifications
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ErrorResponse(500, ex.Message));
            }
        }

        [HttpGet("unread/{userId}")]
        public async Task<IActionResult> GetUnreadNotifications(int userId)
        {
            try
            {
                var notifications = await _notificationService.GetUnreadNotificationsByUserIdAsync(userId);
                return Ok(new BaseAPIResponse<object>
                {
                    Message = "Success",
                    StatusCode = 200,
                    IsSuccess = true,
                    Data = notifications
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ErrorResponse(500, ex.Message));
            }
        }
    }
}

