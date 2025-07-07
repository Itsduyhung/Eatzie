using Eatzie.Models;

namespace Eatzie.Interfaces.IRepository
{
    public interface ISignUpRepository
    {
        Task<UserEntity?> GetByEmailAsync(string email);
        Task<UserEntity> CreateAsync(UserEntity user);
    }
}