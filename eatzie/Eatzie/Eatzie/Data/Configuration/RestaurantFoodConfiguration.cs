using Eatzie.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Eatzie.Data.Configuration;

public class RestaurantFoodConfiguration : IEntityTypeConfiguration<RestaurantFoodEntity>
{
    public void Configure(EntityTypeBuilder<RestaurantFoodEntity> builder)
    {
        builder.ToTable("restaurant_foods");

        builder.HasKey(rf => new { rf.RestaurantId, rf.FoodId });

        builder.Property(rf => rf.CreatedAt).HasDefaultValueSql("NOW()");

        builder.HasOne(rf => rf.Restaurant)
               .WithMany(r => r.RestaurantFoods)
               .HasForeignKey(rf => rf.RestaurantId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(rf => rf.Food)
               .WithMany(f => f.RestaurantFoods)
               .HasForeignKey(rf => rf.FoodId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}