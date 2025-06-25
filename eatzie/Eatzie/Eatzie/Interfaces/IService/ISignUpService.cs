using Eatzie.DTOs.Request;

namespace Eatzie.Interfaces.IService
{
    public interface ISignUpService
    {
        Task<(bool Succeeded, string? ErrorMessage)> SignUpAsync(SignUpRequest request);
    }
}