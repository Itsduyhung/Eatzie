using Eatzie.Data;
using Eatzie.DTOs.Request;
using Eatzie.DTOs.Response;
using Eatzie.Interfaces.IRepository;
using Eatzie.Interfaces.IService;
using Eatzie.Models;
using Microsoft.EntityFrameworkCore;

namespace Eatzie.Services
{
    public class UserDietService(IUserDietRepository userDietRepository, ApplicationDbContext context) : IUserDietService
    {
        private readonly ApplicationDbContext _context = context;
        private readonly IUserDietRepository _userDietRepository = userDietRepository;

        /// <summary>
        /// API for Type Diet
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public async Task<UserDietEntity> CreateUserDietAsync(DietTypeRequest request)
        {
            var existing = await _context.UserDietEntitys
                                         .FirstOrDefaultAsync(ud => ud.UserId == request.UserId);

            if (existing != null)
            {
                existing.Diet_type = request.DietType;
                _context.UserDietEntitys.Update(existing);
                await _context.SaveChangesAsync();
                return existing;
            }

            var newDiet = new UserDietEntity
            {
                UserId = request.UserId,
                Diet_type = request.DietType
            };

            return await _userDietRepository.CreateUserDietAsync(newDiet);
        }
        /// <summary>
        /// API for Alegic_Food
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public async Task<UserDietEntity> UpdateAllergicFoodAsync(AllergicFoodRequest request)
        {
            var existing = await _userDietRepository.GetByUserIdAsync(request.UserId);

            if (existing != null)
            {
                existing.Allergic_food = request.Allergic_food;
                return await _userDietRepository.UpdateAsync(existing);
            }

            var newDiet = new UserDietEntity
            {
                UserId = request.UserId,
                Allergic_food = request.Allergic_food
            };

            return await _userDietRepository.CreateUserDietAsync(newDiet);
        }
        /// <summary>
        /// API For Favou food
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public async Task<UserDietEntity> UpdateFavoriteFoodAsync(FavoriteFoodRequest request)
        {
            var existing = await _userDietRepository.GetByUserIdAsync(request.UserId);

            if (existing != null)
            {
                existing.Favorite_food = request.FavoriteFood;
                return await _userDietRepository.UpdateAsync(existing);
            }

            var newDiet = new UserDietEntity
            {
                UserId = request.UserId,
                Favorite_food = request.FavoriteFood
            };

            return await _userDietRepository.CreateUserDietAsync(newDiet);
        }
        /// <summary>
        /// API for budget input from user
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public async Task<UserDietEntity> UpdateSpendingAsync(SpendingRequest request)
        {
            var existing = await _userDietRepository.GetByUserIdAsync(request.UserId);

            if (existing != null)
            {
                existing.Min_spending = request.Min_spending;
                existing.Max_spending = request.Max_spending;
                return await _userDietRepository.UpdateAsync(existing);
            }

            var newDiet = new UserDietEntity
            {
                UserId = request.UserId,
                Min_spending = request.Min_spending,
                Max_spending = request.Max_spending
            };

            return await _userDietRepository.CreateUserDietAsync(newDiet);
        }
        /// <summary>
        /// API Get data from userdiet
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public async Task<UserDietResponse?> GetUserDietByUserIdAsync(int userId)
        {
            var entity = await _userDietRepository.GetByUserIdAsync(userId);
            if (entity == null) return null;

            return new UserDietResponse
            {
                UserDietId = entity.UserDietId,
                UserId = entity.UserId,
                Allergic_food = entity.Allergic_food,
                Favorite_food = entity.Favorite_food,
                Min_spending = entity.Min_spending,
                Max_spending = entity.Max_spending,
                Diet_type = (int)entity.Diet_type
            };
        }

        /// <summary>
        /// API PUT for all field userdiet
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>

        public async Task<UserDietEntity> UpdateUserDietAsync(UserDietRequest request)
        {
            var existing = await _userDietRepository.GetByUserIdAsync(request.UserId) ?? throw new Exception("UserDiet not found");
            existing.Allergic_food = request.AllergicFood ?? existing.Allergic_food;
            existing.Favorite_food = request.FavoriteFood ?? existing.Favorite_food;
            existing.Min_spending = request.MinSpending ?? existing.Min_spending;
            existing.Max_spending = request.MaxSpending ?? existing.Max_spending;
            existing.Diet_type = request.DietType ?? existing.Diet_type;

            return await _userDietRepository.UpdateAsync(existing);
        }
    }
}