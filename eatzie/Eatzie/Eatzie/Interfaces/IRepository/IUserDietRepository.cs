using Eatzie.Models;

namespace Eatzie.Interfaces.IRepository
{
    public interface IUserDietRepository
    {
        Task<UserDietEntity> CreateUserDietAsync(UserDietEntity entity);
        Task<UserDietEntity?> GetByUserIdAsync(int userId);
        Task<UserDietEntity> UpdateAsync(UserDietEntity entity);

    }
}