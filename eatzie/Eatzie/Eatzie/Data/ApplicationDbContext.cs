using Microsoft.EntityFrameworkCore;
using Eatzie.Data.Configuration;
using Eatzie.Models;

namespace Eatzie.Data
{
    public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
    {
        public DbSet<UserEntity> UserEntitys { get; set; }
        public DbSet<PasswordResetToken> PasswordResetTokens { get; set; }
        public DbSet<FoodEntity> Foods { get; set; }
        public DbSet<HistoryFoodEntity> HistoryFoodEntitys { get; set; }
        public DbSet<UserDietEntity> UserDietEntitys { get; set; }
        public DbSet<UserDietFoodEntity> UserDietFoodEntitys { get; set; }
        public DbSet<FeedbackEntity> FeedbackEntitys { get; set; }
        public DbSet<FoodViewEntity> FoodViews { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfiguration(new UserConfiguration());
            modelBuilder.ApplyConfiguration(new PasswordResetTokenConfiguration());
            modelBuilder.ApplyConfiguration(new FoodConfiguration());
            modelBuilder.ApplyConfiguration(new UserDietConfiguration());
            modelBuilder.ApplyConfiguration(new UserDietFoodConfiguration());
            modelBuilder.ApplyConfiguration(new HistoryFoodConfiguration());
            modelBuilder.ApplyConfiguration(new FeedbackConfiguration());
            modelBuilder.ApplyConfiguration(new FoodViewConfiguration());
        }
    }
}