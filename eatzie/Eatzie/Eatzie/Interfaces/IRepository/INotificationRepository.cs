using Eatzie.Models;

namespace Eatzie.Interfaces.IRepository
{
    public interface INotificationRepository
    {
        Task<NotificationEntity> CreateAsync(NotificationEntity notification);
        Task<IEnumerable<NotificationEntity>> GetReadByUserIdAsync(int userId);
        Task<IEnumerable<NotificationEntity>> GetUnreadByUserIdAsync(int userId);
    }
}

