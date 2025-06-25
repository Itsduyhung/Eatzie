using Eatzie.Data;
using Eatzie.Interfaces.IRepository;
using Eatzie.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace Eatzie.Repositories
{
    public class PasswordResetTokenRepository(ApplicationDbContext context) : IPasswordResetTokenRepository
    {
        private readonly ApplicationDbContext _context = context;

        public async Task CreateAsync(PasswordResetToken token)
        {
            await _context.PasswordResetTokens.AddAsync(token);
            await _context.SaveChangesAsync();
        }

        public async Task<PasswordResetToken?> GetByOtpAndEmailAsync(string otp, string email)
        {
            return await _context.PasswordResetTokens
                .Include(t => t.User)
                .FirstOrDefaultAsync(t => t.Otp == otp && t.User.Email == email);
        }

        public async Task<PasswordResetToken?> GetByResetTokenAsync(string token)
        {
            return await _context.PasswordResetTokens.FirstOrDefaultAsync(t => t.ResetToken == token);
        }

        public async Task UpdateAsync(PasswordResetToken token)
        {
            _context.PasswordResetTokens.Update(token);
            await _context.SaveChangesAsync();
        }
    }
}