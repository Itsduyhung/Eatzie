using Eatzie.Data;
using Eatzie.Interfaces.IRepository;
using Eatzie.Models;
using Microsoft.EntityFrameworkCore;

namespace Eatzie.Repositories
{
    public class UserDietRepository(ApplicationDbContext context) : IUserDietRepository
    {
        private readonly ApplicationDbContext _context = context;

        /// <summary>
        /// Type diet
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public async Task<UserDietEntity> CreateUserDietAsync(UserDietEntity entity)
        {
            _context.UserDietEntitys.Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        /// <summary>
        /// Handle for Alegic food
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public async Task<UserDietEntity?> GetByUserIdAsync(int userId)
        {
            return await _context.UserDietEntitys.FirstOrDefaultAsync(x => x.UserId == userId);
        }

        public async Task<UserDietEntity> UpdateAsync(UserDietEntity entity)
        {
            _context.UserDietEntitys.Update(entity);
            await _context.SaveChangesAsync();
            return entity;
        }
    }
}