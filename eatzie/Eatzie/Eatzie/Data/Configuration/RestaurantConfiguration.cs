using Eatzie.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Eatzie.Data.Configuration;

public class RestaurantConfiguration : IEntityTypeConfiguration<RestaurantEntity>
{
    public void Configure(EntityTypeBuilder<RestaurantEntity> builder)
    {
        builder.ToTable("restaurants");
        builder.HasKey(r => r.Id);
        builder.Property(r => r.Id).UseIdentityColumn();
        builder.Property(r => r.Name).IsRequired().HasMaxLength(255);
        builder.Property(r => r.Description);
        builder.Property(r => r.PhoneNumber).HasMaxLength(20);
        builder.Property(r => r.Address);
        builder.Property(r => r.Latitude).HasColumnType("numeric(10, 8)");
        builder.Property(r => r.Longitude).HasColumnType("numeric(11, 8)");
        builder.Property(r => r.Status).HasMaxLength(20).HasDefaultValue("Closed");
        builder.Property(r => r.CreatedAt).HasDefaultValueSql("NOW()");

        builder.HasOne(r => r.User)
               .WithMany()
               .HasForeignKey(r => r.UserId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}