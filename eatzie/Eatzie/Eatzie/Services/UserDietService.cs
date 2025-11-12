using Eatzie.Data;
using Eatzie.DTOs.Request;
using Eatzie.DTOs.Response;
using Eatzie.Hubs;
using Eatzie.Interfaces.IRepository;
using Eatzie.Interfaces.IService;
using Eatzie.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace Eatzie.Services
{
    public class UserDietService : IUserDietService
    {
        private readonly ApplicationDbContext _context;
        private readonly IUserDietRepository _userDietRepository;
        private readonly INotificationService _notificationService;
        private readonly IHubContext<NotificationHub> _hubContext;

        public UserDietService(
            IUserDietRepository userDietRepository,
            ApplicationDbContext context,
            INotificationService notificationService,
            IHubContext<NotificationHub> hubContext)
        {
            _context = context;
            _userDietRepository = userDietRepository;
            _notificationService = notificationService;
            _hubContext = hubContext;
        }

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
                UserDietId = entity.Id,
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

        public async Task<UserDietResponse> UpdateUserDietAsync(UserDietRequest request)
        {
            var existing = await _userDietRepository.GetByUserIdAsync(request.UserId) ?? throw new Exception("UserDiet not found");
            existing.Allergic_food = request.AllergicFood ?? existing.Allergic_food;
            existing.Favorite_food = request.FavoriteFood ?? existing.Favorite_food;
            existing.Min_spending = request.MinSpending ?? existing.Min_spending;
            existing.Max_spending = request.MaxSpending ?? existing.Max_spending;
            existing.Diet_type = request.DietType ?? existing.Diet_type;

            var updated = await _userDietRepository.UpdateAsync(existing);

            // Send notification via SignalR
            try
            {
                var user = await _context.UserEntitys.FindAsync(request.UserId);
                var userName = user?.Fullname ?? "Bạn";

                var notification = await _notificationService.CreateNotificationAsync(
                    userId: request.UserId,
                    title: "Hồ sơ vị giác đã được cập nhật",
                    content: $"{userName} đã cập nhật hồ sơ vị giác của mình thành công. Chúng tôi sẽ đề xuất món ăn phù hợp hơn với sở thích của bạn!",
                    type: "success",
                    avatarUrl: user?.Avatar
                );

                // Send real-time notification via SignalR
                await _hubContext.Clients.Group($"user_{request.UserId}").SendAsync("ReceiveNotification", notification);
            }
            catch (Exception ex)
            {
                // Log error but don't fail the update
                Console.WriteLine($"Error sending notification: {ex.Message}");
            }

            // Return DTO instead of Entity to avoid circular reference
            return new UserDietResponse
            {
                UserDietId = updated.Id,
                UserId = updated.UserId,
                Allergic_food = updated.Allergic_food,
                Favorite_food = updated.Favorite_food,
                Min_spending = updated.Min_spending,
                Max_spending = updated.Max_spending,
                Diet_type = (int)updated.Diet_type
            };
        }
    }
}