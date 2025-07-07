using Eatzie.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Eatzie.Data.Configuration
{
    public class FoodViewConfiguration : IEntityTypeConfiguration<FoodViewEntity>
    {
        public void Configure(EntityTypeBuilder<FoodViewEntity> builder)
        {
            builder.ToTable("food_views");
            builder.HasKey(f => f.Id);

            builder.Property(f => f.DeviceInfo).HasMaxLength(255);
            builder.Property(f => f.ViewedAt).HasDefaultValueSql("NOW()");

            builder.HasOne(f => f.User)
                   .WithMany(u => u.FoodViews)
                   .HasForeignKey(f => f.UserId)
                   .OnDelete(DeleteBehavior.SetNull);

            builder.HasOne(f => f.Food)
                   .WithMany(f => f.FoodViews)
                   .HasForeignKey(f => f.Food_id);
        }
    }
}