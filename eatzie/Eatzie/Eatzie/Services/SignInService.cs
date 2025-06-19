using Eatzie.DTOs.Request;
using Eatzie.DTOs.Response;
using Eatzie.Interfaces.IRepository;
using Eatzie.Interfaces.IService;
using System.Net;
using System.Threading.Tasks;
using Eatzie.Helpers;

namespace Eatzie.Services
{
    public class SignInService(ISignInRepository signinRepository) : ISignInService
    {
        private readonly ISignInRepository _signinRepository = signinRepository;

        public async Task<BaseAPIResponse> SignInAsync(SignInRequest request)
        {
            var user = await _signinRepository.GetUserByEmailAsync(request.Email);

            if (user == null)
            {
                return new BaseAPIResponse
                {
                    StatusCode = (int)HttpStatusCode.Unauthorized,
                    IsSuccess = false,
                    Message = "User doesn't exist."
                };
            }

            bool isPasswordValid = (request.Password == user.Password);

            if (!isPasswordValid)
            {
                return new BaseAPIResponse
                {
                    StatusCode = (int)HttpStatusCode.Unauthorized,
                    IsSuccess = false,
                    Message = "Email or PassWord is invalid."
                };
            }
            return new BaseAPIResponse(
                message: "Sign In successful!",
                statusCode: (int)HttpStatusCode.OK,
                isSuccess: true
            );
        }
    }
}