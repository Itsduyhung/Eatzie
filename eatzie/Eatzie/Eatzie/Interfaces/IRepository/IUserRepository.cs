using Eatzie.Models;

namespace Eatzie.Interfaces.IRepository
{
    public interface IUserRepository
    {
        Task<UserEntity?> GetByIdAsync(int id);
        Task UpdateAsync(UserEntity user);
    }
}