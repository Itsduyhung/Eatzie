using Eatzie.DTOs.Request;
using Eatzie.DTOs.Response;

namespace Eatzie.Interfaces.IService
{
    public interface IUserService
    {
        Task<ProfileResponse?> GetProfileAsync(int id);
        Task<bool> UpdateProfileAsync(int id, ProfileRequest request);
    }
}