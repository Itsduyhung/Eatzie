using Eatzie.Data;
using Eatzie.DTOs.Request;
using Eatzie.Interfaces.IRepository;
using Eatzie.Interfaces.IService;
using Eatzie.Models;
using Microsoft.EntityFrameworkCore;

namespace Eatzie.Services
{
    public class UserDietService(IUserDietRepository userDietRepository, ApplicationDbContext context) : IUserDietService
    {
        private readonly ApplicationDbContext _context = context;
        private readonly IUserDietRepository _userDietRepository = userDietRepository;

        public async Task<UserDietEntity> CreateUserDietAsync(UserDietRequest request)
        {
            var existing = await _context.UserDietEntitys
                                         .FirstOrDefaultAsync(ud => ud.UserId == request.UserId);

            if (existing != null)
            {
                // Ghi đè
                existing.Diet_type = request.DietType;
                _context.UserDietEntitys.Update(existing);
                await _context.SaveChangesAsync();
                return existing;
            }

            var newDiet = new UserDietEntity
            {
                UserId = request.UserId,
                Diet_type = request.DietType
            };

            return await _userDietRepository.CreateUserDietAsync(newDiet);
        }
    }
}