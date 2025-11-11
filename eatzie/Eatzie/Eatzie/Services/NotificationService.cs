using Eatzie.DTOs.Response;
using Eatzie.Interfaces.IRepository;
using Eatzie.Interfaces.IService;
using Eatzie.Models;

namespace Eatzie.Services
{
    public class NotificationService : INotificationService
    {
        private readonly INotificationRepository _notificationRepository;

        public NotificationService(INotificationRepository notificationRepository)
        {
            _notificationRepository = notificationRepository;
        }

        public async Task<NotificationResponse> CreateNotificationAsync(int userId, string title, string content, string type = "info", string? avatarUrl = null)
        {
            var notification = new NotificationEntity
            {
                UserId = userId,
                Title = title,
                Content = content,
                Type = type,
                AvatarUrl = avatarUrl,
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            };

            var created = await _notificationRepository.CreateAsync(notification);

            return new NotificationResponse
            {
                Id = created.Id,
                UserId = created.UserId,
                Title = created.Title,
                Content = created.Content,
                Type = created.Type,
                IsRead = created.IsRead,
                CreatedAt = created.CreatedAt,
                AvatarUrl = created.AvatarUrl
            };
        }

        public async Task<IEnumerable<NotificationResponse>> GetReadNotificationsByUserIdAsync(int userId)
        {
            var notifications = await _notificationRepository.GetReadByUserIdAsync(userId);
            return notifications.Select(n => new NotificationResponse
            {
                Id = n.Id,
                UserId = n.UserId,
                Title = n.Title,
                Content = n.Content,
                Type = n.Type,
                IsRead = n.IsRead,
                CreatedAt = n.CreatedAt,
                AvatarUrl = n.AvatarUrl
            });
        }

        public async Task<IEnumerable<NotificationResponse>> GetUnreadNotificationsByUserIdAsync(int userId)
        {
            var notifications = await _notificationRepository.GetUnreadByUserIdAsync(userId);
            return notifications.Select(n => new NotificationResponse
            {
                Id = n.Id,
                UserId = n.UserId,
                Title = n.Title,
                Content = n.Content,
                Type = n.Type,
                IsRead = n.IsRead,
                CreatedAt = n.CreatedAt,
                AvatarUrl = n.AvatarUrl
            });
        }
    }
}

