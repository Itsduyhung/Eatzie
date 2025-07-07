using Eatzie.DTOs.Request;
using Eatzie.Helpers;
using Eatzie.Interfaces.IService;
using Microsoft.AspNetCore.Mvc;

namespace Eatzie.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProfileController(IUserService userService) : ControllerBase
    {
        private readonly IUserService _userService = userService;

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProfile(int id)
        {
            var profile = await _userService.GetProfileAsync(id);
            if (profile == null)
                return NotFound(new ErrorResponse(404, "User not found"));

            return Ok(profile);
        }

        [HttpPut("{userId}")]
        public async Task<IActionResult> UpdateProfile(int userId, [FromForm] ProfileRequest request)
        {
            var result = await _userService.UpdateProfileAsync(userId, request);

            if (!result)
                return NotFound(new ErrorResponse(404, "User not found"));

            return Ok(new BaseAPIResponse("Cập nhật hồ sơ thành công", 200, true));
        }
        //    [HttpPost("avatar")]
        //    public async Task<IActionResult> UploadAvatar([FromForm] UploadAvatarRequest request)
        //    {
        //        if (request.Avatar == null)
        //        {
        //            return BadRequest(new ErrorResponse(400, "Avatar is required"));
        //        }

        //        var url = await _userService.UploadAvatarAsync(request.UserId, request.Avatar);
        //        if (url == null)
        //            return NotFound(new ErrorResponse(404, "User not found"));

        //        return Ok(new BaseAPIResponse("Avatar uploaded successfully", 200, true));
        //    }
        //}
    }
}