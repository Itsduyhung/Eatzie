using Eatzie.DTOs.Response;

namespace Eatzie.Interfaces.IService
{
    public interface INotificationService
    {
        Task<NotificationResponse> CreateNotificationAsync(int userId, string title, string content, string type = "info", string? avatarUrl = null);
        Task<IEnumerable<NotificationResponse>> GetReadNotificationsByUserIdAsync(int userId);
        Task<IEnumerable<NotificationResponse>> GetUnreadNotificationsByUserIdAsync(int userId);
    }
}

