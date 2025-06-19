using Eatzie.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Eatzie.Data;
using Eatzie.Interfaces.IRepository;

namespace Eatzie.Repositories
{
    public class SignInRepository : ISignInRepository
    {
        private readonly ApplicationDbContext _context;

        public SignInRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<User> GetUserByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }
    }
}