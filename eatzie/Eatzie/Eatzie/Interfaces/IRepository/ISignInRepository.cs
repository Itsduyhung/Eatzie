using Eatzie.Models;
using System.Threading.Tasks;

namespace Eatzie.Interfaces.IRepository
{
    public interface ISignInRepository
    {
        Task<UserEntity> GetUserByEmailAsync(string email);
    }
}