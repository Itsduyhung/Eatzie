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
            builder.HasKey(f => f.Id);

            builder.Property(f => f.Content).IsRequired();
            builder.Property(f => f.Description);
            builder.Property(f => f.ImageUrl);
            builder.Property(f => f.IsVegetarian).HasDefaultValue(false);
            builder.Property(f => f.CreatedAt).HasDefaultValueSql("NOW()");
        }
    }
}