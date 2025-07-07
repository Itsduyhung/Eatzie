using Eatzie.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Eatzie.Data;
using Eatzie.Interfaces.IRepository;

namespace Eatzie.Repositories
{
    public class SignInRepository(ApplicationDbContext context) : ISignInRepository
    {
        private readonly ApplicationDbContext _context = context;

        public async Task<UserEntity> GetUserByEmailAsync(string email)
        {
            return await _context.UserEntitys.FirstOrDefaultAsync(u => u.Email == email);
        }
    }
}