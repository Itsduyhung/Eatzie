using Eatzie.Configurations;
using Eatzie.Data.Configuration;
using Eatzie.Models;
using Microsoft.EntityFrameworkCore;

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
        public DbSet<SavedFoodEntity> SavedFoods { get; set; }
        public DbSet<CartItemEntity> CartItems { get; set; }
        public DbSet<OrderEntity> Orders { get; set; }
        public DbSet<OrderDetailEntity> OrderItems { get; set; }

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
            modelBuilder.ApplyConfiguration(new SavedFoodConfiguration());
            modelBuilder.ApplyConfiguration(new CartItemConfiguration());
            modelBuilder.ApplyConfiguration(new OrderConfiguration());
            modelBuilder.ApplyConfiguration(new OrderDetailConfiguration());
        }
    }
}