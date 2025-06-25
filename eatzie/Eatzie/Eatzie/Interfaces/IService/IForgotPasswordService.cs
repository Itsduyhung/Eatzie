using System.Threading.Tasks;
using Eatzie.DTOs.Request;

namespace Eatzie.Interfaces.IService
{
    public interface IForgotPasswordService
    {
        Task ForgotPasswordAsync(string email);
        Task<string?> VerifyOtpAsync(VerifyOtpRequest request);
        Task<(bool Succeeded, string Message)> SetNewPasswordAsync(ResetPasswordRequest request);
    }
}