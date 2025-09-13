using Eatzie.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Eatzie.Data.Configuration;

public class FoodCategoryConfiguration : IEntityTypeConfiguration<FoodCategoryEntity>
{
    public void Configure(EntityTypeBuilder<FoodCategoryEntity> builder)
    {
        builder.ToTable("food_categories");
        builder.HasKey(fc => fc.Id);

        builder.Property(fc => fc.Id).UseIdentityColumn();
        builder.Property(fc => fc.Name).IsRequired().HasMaxLength(255);
    }
}