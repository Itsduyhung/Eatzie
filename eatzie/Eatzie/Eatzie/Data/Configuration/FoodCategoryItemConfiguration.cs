using Eatzie.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Eatzie.Data.Configuration;

public class FoodCategoryItemConfiguration : IEntityTypeConfiguration<FoodCategoryItemEntity>
{
    public void Configure(EntityTypeBuilder<FoodCategoryItemEntity> builder)
    {
        builder.ToTable("food_category_items");

        // Cú pháp mới cho khóa chính phức hợp
        builder.HasKey(fci => new { fci.CategoryId, fci.FoodId });

        builder.Property(fci => fci.CreatedAt).HasDefaultValueSql("NOW()");

        builder.HasOne(fci => fci.Category)
               .WithMany(c => c.FoodCategoryItems)
               .HasForeignKey(fci => fci.CategoryId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(fci => fci.Food)
               .WithMany(f => f.FoodCategoryItems)
               .HasForeignKey(fci => fci.FoodId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}