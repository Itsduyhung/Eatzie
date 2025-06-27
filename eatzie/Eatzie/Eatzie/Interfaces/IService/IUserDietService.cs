using Eatzie.DTOs.Request;
using Eatzie.DTOs.Response;
using Eatzie.Models;

namespace Eatzie.Interfaces.IService
{
    public interface IUserDietService
    {
        Task<UserDietEntity> CreateUserDietAsync(DietTypeRequest request);
        Task<UserDietEntity> UpdateAllergicFoodAsync(AllergicFoodRequest request);
        Task<UserDietEntity> UpdateFavoriteFoodAsync(FavoriteFoodRequest request);
        Task<UserDietEntity> UpdateSpendingAsync(SpendingRequest request);
        Task<UserDietResponse?> GetUserDietByUserIdAsync(int userId);
        Task<UserDietEntity> UpdateUserDietAsync(UserDietRequest request);
    }
}