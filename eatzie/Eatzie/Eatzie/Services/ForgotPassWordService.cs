using Eatzie.Interfaces.IRepository;
using Eatzie.Interfaces.IService;
using Eatzie.Models;
using System.Security.Cryptography;
using Eatzie.DTOs.Request;
using System;
using System.Threading.Tasks;

namespace Eatzie.Services
{
    public class ForgotPasswordService : IForgotPasswordService
    {
        private readonly IForgotPasswordRepository _userRepository;
        private readonly IPasswordResetTokenRepository _tokenRepository;
        private readonly IEmailService _emailService;

        public ForgotPasswordService(
            IForgotPasswordRepository userRepository,
            IPasswordResetTokenRepository tokenRepository,
            IEmailService emailService)
        {
            _userRepository = userRepository;
            _tokenRepository = tokenRepository;
            _emailService = emailService;
        }

        public async Task ForgotPasswordAsync(string email)
        {
            var user = await _userRepository.GetByEmailAsync(email);
            if (user == null) return;

            var otp = new Random().Next(100000, 999999).ToString();

            var passwordResetToken = new PasswordResetToken
            {
                UserId = user.Id,
                Otp = otp,
                OtpExpiresAt = DateTime.UtcNow.AddMinutes(5)
            };
            await _tokenRepository.CreateAsync(passwordResetToken);

            var subject = "Yêu cầu đặt lại mật khẩu";
            var body = $"<p>Mã OTP của bạn là: <strong>{otp}</strong></p>";
            await _emailService.SendEmailAsync(user.Email, subject, body);
        }

        public async Task<string?> VerifyOtpAsync(VerifyOtpRequest request)
        {
            var tokenRecord = await _tokenRepository.GetByOtpAndEmailAsync(request.Otp, request.Email);

            if (tokenRecord == null || tokenRecord.OtpExpiresAt < DateTime.UtcNow)
            {
                return null;
            }

            var resetToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32))
                                   .TrimEnd('=').Replace('+', '-').Replace('/', '_');

            tokenRecord.ResetToken = resetToken;
            tokenRecord.ResetTokenExpiresAt = DateTime.UtcNow.AddMinutes(10);
            tokenRecord.Otp = null;
            tokenRecord.OtpExpiresAt = null;

            await _tokenRepository.UpdateAsync(tokenRecord);

            return resetToken;
        }

        public async Task<(bool Succeeded, string Message)> SetNewPasswordAsync(ResetPasswordRequest request)
        {
            var tokenRecord = await _tokenRepository.GetByResetTokenAsync(request.ResetToken);

            if (tokenRecord == null || tokenRecord.ResetTokenExpiresAt < DateTime.UtcNow)
            {
                return (false, "Yêu cầu không hợp lệ hoặc đã hết hạn.");
            }

            var user = await _userRepository.GetByIdAsync(tokenRecord.UserId);
            if (user == null) return (false, "Người dùng không tồn tại.");

            user.Password = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            await _userRepository.UpdateAsync(user);

            tokenRecord.ResetToken = null;
            tokenRecord.ResetTokenExpiresAt = null;
            await _tokenRepository.UpdateAsync(tokenRecord);

            return (true, "Đặt lại mật khẩu thành công.");
        }
    }
}