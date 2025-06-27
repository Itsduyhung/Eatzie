using Eatzie.DTOs.Request;
using Eatzie.Models;

namespace Eatzie.Interfaces.IService
{
    public interface IUserDietService
    {
        Task<UserDietEntity> CreateUserDietAsync(UserDietRequest request);
        Task<UserDietEntity> UpdateAllergicFoodAsync(AllergicFoodRequest request);
    }
}