using Eatzie.Interfaces.IService;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Eatzie.DTOs.Request;
using Eatzie.DTOs.Response;
using Eatzie.Helpers;
using System.Linq;
using System.Net;

namespace Eatzie.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SignInController : ControllerBase
    {
        private readonly ISignInService _signinService;

        public SignInController(ISignInService signinService)
        {
            _signinService = signinService;
        }

        /// <summary>
        /// API Post for Login Screen
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost("signin")]
        public async Task<IActionResult> SignIn([FromBody] SignInRequest request)
        {
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
            var serviceResponse = await _signinService.SignInAsync(request);

            if (!serviceResponse.IsSuccess)
            {
                return StatusCode(serviceResponse.StatusCode, new ErrorResponse(
                    statusCode: serviceResponse.StatusCode,
                    message: serviceResponse.Message
                ));
            }
            return Ok(serviceResponse);
        }
    }
}