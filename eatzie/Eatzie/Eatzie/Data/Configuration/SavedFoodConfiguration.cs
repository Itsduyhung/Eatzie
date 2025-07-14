using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Eatzie.Models;

public class SavedFoodConfiguration : IEntityTypeConfiguration<SavedFoodEntity>
{
    public void Configure(EntityTypeBuilder<SavedFoodEntity> builder)
    {
        builder.ToTable("saved_foods");

        builder.HasKey(sf => sf.Id);

        builder.Property(sf => sf.UserId)
            .HasColumnName("UserId")
            .IsRequired();

        builder.Property(sf => sf.FoodId)
            .HasColumnName("Food_id")
            .IsRequired();

        builder.Property(sf => sf.SavedAt)
            .HasColumnName("Savedat");

        builder.HasOne(sf => sf.User)
            .WithMany(u => u.SavedFoods)
            .HasForeignKey(sf => sf.UserId);

        builder.HasOne(sf => sf.Food)
            .WithMany(f => f.SavedByUsers)
            .HasForeignKey(sf => sf.FoodId);
    }
}