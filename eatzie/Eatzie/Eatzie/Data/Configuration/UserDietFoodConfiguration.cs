using Eatzie.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Eatzie.Data.Configuration
{
    public class UserDietFoodConfiguration : IEntityTypeConfiguration<UserDietFoodEntity>
    {
        public void Configure(EntityTypeBuilder<UserDietFoodEntity> builder)
        {
            builder.ToTable("userdiet_foods");

            builder.HasKey(udf => new { udf.UserDietId, udf.FoodId });

            builder.HasOne(udf => udf.UserDiet)
                   .WithMany(ud => ud.UserDietFoods)
                   .HasForeignKey(udf => udf.UserDietId);

            builder.HasOne(udf => udf.Food)
                   .WithMany(f => f.UserDietFoods)
                   .HasForeignKey(udf => udf.FoodId);
        }
    }
}