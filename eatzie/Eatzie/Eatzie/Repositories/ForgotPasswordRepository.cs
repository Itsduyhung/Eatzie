using Eatzie.Data;
using Eatzie.Interfaces.IRepository;
using Eatzie.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace Eatzie.Repositories
{
    public class ForgotPasswordRepository : IForgotPasswordRepository
    {
        private readonly ApplicationDbContext _context;

        public ForgotPasswordRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task UpdateAsync(User user)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }
    }
}