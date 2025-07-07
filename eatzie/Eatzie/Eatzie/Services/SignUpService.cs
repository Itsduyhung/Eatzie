using Eatzie.DTOs.Request;
using Eatzie.Interfaces.IRepository;
using Eatzie.Interfaces.IService;
using Eatzie.Models;

namespace Eatzie.Services
{
    public class SignUpService(ISignUpRepository userRepository) : ISignUpService
    {
        private readonly ISignUpRepository _userRepository = userRepository;

        public async Task<(bool Succeeded, string? ErrorMessage)> SignUpAsync(SignUpRequest request)
        {
            var existingUser = await _userRepository.GetByEmailAsync(request.Email);
            if (existingUser != null)
            {
                return (false, "Địa chỉ email này đã được sử dụng.");
            }

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password, 12);

            var newUser = new UserEntity
            {
                Fullname = request.Fullname,
                Email = request.Email,
                Password = hashedPassword,
                CreatedAt = DateTime.UtcNow
            };

            await _userRepository.CreateAsync(newUser);

            return (true, null);
        }
    }
}