using Eatzie.Helpers;

namespace Eatzie.DTOs.Response
{
    public class SignInResponse : BaseAPIResponse
    {
        public int UserId { get; set; }

        public SignInResponse() { }

        public SignInResponse(string message, int statusCode, bool isSuccess, int userId)
            : base(message, statusCode, isSuccess)
        {
            UserId = userId;
        }
    }
}