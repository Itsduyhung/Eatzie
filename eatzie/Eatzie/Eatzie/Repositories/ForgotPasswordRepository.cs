using Eatzie.Data;
using Eatzie.Interfaces.IRepository;
using Eatzie.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace Eatzie.Repositories
{
    public class ForgotPasswordRepository(ApplicationDbContext context) : IForgotPasswordRepository
    {
        private readonly ApplicationDbContext _context = context;

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _context.UserEntitys.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            return await _context.UserEntitys.FindAsync(id);
        }

        public async Task UpdateAsync(User user)
        {
            _context.UserEntitys.Update(user);
            await _context.SaveChangesAsync();
        }
    }
}