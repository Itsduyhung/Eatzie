using Eatzie.DTOs.Request;
using Eatzie.DTOs.Response;
using Eatzie.Helpers;
using Eatzie.Interfaces.IService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Eatzie.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SignInController(ISignInService signinService, IConfiguration configuration) : ControllerBase
    {
        private readonly ISignInService _signinService = signinService;
        private readonly IConfiguration _configuration = configuration;

        [HttpPost("signin")]
        public async Task<IActionResult> SignIn([FromBody] SignInRequest request)
        {
            // Validate request
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Where(x => x.Value.Errors.Any())
                                       .SelectMany(x => x.Value.Errors.Select(e => new ErrorField
                                       {
                                           FieldName = x.Key,
                                           ErrorMessage = e.ErrorMessage
                                       }))
                                       .ToList();

                return BadRequest(new ErrorResponse(
                    statusCode: (int)HttpStatusCode.BadRequest,
                    message: "Validation failed.",
                    errorFields: errors
                ));
            }

            // Gọi Service
            var response = await _signinService.SignInAsync(request);

            if (!response.IsSuccess)
            {
                return StatusCode(response.StatusCode, new ErrorResponse(
                    response.StatusCode,
                    response.Message
                ));
            }

            // Ép kiểu để lấy UserId
            if (response is not SignInResponse signInResponse)
            {
                return StatusCode(500, new ErrorResponse(500, "Không thể xử lý đăng nhập."));
            }

            // Tạo JWT Token
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, signInResponse.UserId.ToString()),
                new Claim(ClaimTypes.Email, request.Email),
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(100),
                signingCredentials: creds
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            return Ok(new
            {
                Token = tokenString,
                signInResponse.Message
            });
        }
    }
}