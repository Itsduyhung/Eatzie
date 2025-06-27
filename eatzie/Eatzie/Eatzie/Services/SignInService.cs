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
                    Message = "Người dùng không tồn tại."
                };
            }

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.Password);
            if (!isPasswordValid)
            {
                return new BaseAPIResponse
                {
                    StatusCode = (int)HttpStatusCode.Unauthorized,
                    IsSuccess = false,
                    Message = "Email hoặc PassWord đang không đúng."
                };
            }

            return new SignInResponse(
                message: "Đăng nhập thành công!",
                statusCode: (int)HttpStatusCode.OK,
                isSuccess: true,
                userId: user.Id
            );
        }
    }
}