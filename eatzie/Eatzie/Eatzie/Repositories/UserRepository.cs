using Eatzie.Data;
using Eatzie.Interfaces.IRepository;
using Eatzie.Models;
using Microsoft.EntityFrameworkCore;

namespace Eatzie.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _context;

        public UserRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<UserEntity?> GetByIdAsync(int id)
        {
            return await _context.UserEntitys.FindAsync(id);
        }

        public async Task UpdateAsync(UserEntity user)
        {
            _context.UserEntitys.Update(user);
            await _context.SaveChangesAsync();
        }
    }
}
