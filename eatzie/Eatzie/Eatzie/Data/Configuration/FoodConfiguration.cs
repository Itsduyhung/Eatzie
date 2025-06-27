using Eatzie.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Eatzie.Data.Configuration
{
    public class FoodConfiguration : IEntityTypeConfiguration<FoodEntity>
    {
        public void Configure(EntityTypeBuilder<FoodEntity> builder)
        {
            builder.ToTable("foods");

            builder.Property(f => f.Content)
                   .IsRequired();

            builder.Property(f => f.IsVegetarian)
                   .IsRequired();

            builder.HasMany(f => f.UserDietFoods)
                   .WithOne(udf => udf.Food)
                   .HasForeignKey(udf => udf.FoodId);

            builder.HasMany(f => f.HistoryFoods)
                   .WithOne(h => h.Food)
                   .HasForeignKey(h => h.FoodId);
        }
    }
}