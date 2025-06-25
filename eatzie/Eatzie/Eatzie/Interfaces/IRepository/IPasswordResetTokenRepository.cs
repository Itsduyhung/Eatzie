using Eatzie.Models;
using System.Threading.Tasks;

namespace Eatzie.Interfaces.IRepository
{
    public interface IPasswordResetTokenRepository
    {
        Task CreateAsync(PasswordResetToken token);
        Task<PasswordResetToken?> GetByOtpAndEmailAsync(string otp, string email);
        Task<PasswordResetToken?> GetByResetTokenAsync(string token);
        Task UpdateAsync(PasswordResetToken token);
    }
}