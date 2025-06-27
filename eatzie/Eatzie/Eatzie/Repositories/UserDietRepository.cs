using Eatzie.Data;
using Eatzie.Interfaces.IRepository;
using Eatzie.Models;

namespace Eatzie.Repositories
{
    public class UserDietRepository(ApplicationDbContext context) : IUserDietRepository
    {
        private readonly ApplicationDbContext _context = context;

        public async Task<UserDietEntity> CreateUserDietAsync(UserDietEntity entity)
        {
            _context.UserDietEntitys.Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }
    }
}