using Eatzie.Models;
using System.Threading.Tasks;

namespace Eatzie.Interfaces.IRepository
{
    public interface IForgotPasswordRepository
    {
        Task<User?> GetByEmailAsync(string email);
        Task<User?> GetByIdAsync(int id);
        Task UpdateAsync(User user);
    }
}