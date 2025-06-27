using Eatzie.Models;

namespace Eatzie.Interfaces.IRepository
{
    public interface IUserDietRepository
    {
        Task<UserDietEntity> CreateUserDietAsync(UserDietEntity entity);
    }
}