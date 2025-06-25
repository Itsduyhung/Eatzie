using Eatzie.Models;

namespace Eatzie.Interfaces.IRepository
{
    public interface ISignUpRepository
    {
        Task<User?> GetByEmailAsync(string email);
        Task<User> CreateAsync(User user);
    }
}