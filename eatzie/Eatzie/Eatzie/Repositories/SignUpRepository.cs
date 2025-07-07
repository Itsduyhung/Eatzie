using Eatzie.Interfaces.IRepository;
using Eatzie.Models;
using Microsoft.EntityFrameworkCore;
using System;
using Eatzie.Data;

namespace Eatzie.Repositories
{
    public class SignUpRepository(ApplicationDbContext context) : ISignUpRepository
    {
        private readonly ApplicationDbContext _context = context;

        public async Task<UserEntity?> GetByEmailAsync(string email)
        {
            return await _context.UserEntitys.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<UserEntity> CreateAsync(UserEntity user)
        {
            await _context.UserEntitys.AddAsync(user);
            await _context.SaveChangesAsync();
            return user;
        }
    }
}