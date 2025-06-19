using Eatzie.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Eatzie.Data.Configuration
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.ToTable("users");

            builder.HasKey(u => u.Id);

            builder.Property(u => u.Id)
                   .HasColumnName("id")
                   .ValueGeneratedOnAdd();

            builder.Property(u => u.Fullname)
                   .HasColumnName("fullname")
                   .HasMaxLength(255);

            builder.Property(u => u.Email)
                   .HasColumnName("email")
                   .IsRequired()
                   .HasMaxLength(255);

            builder.HasIndex(u => u.Email).IsUnique();

            builder.Property(u => u.Password)
                   .HasColumnName("password")
                   .IsRequired()
                   .HasMaxLength(255);

            builder.Property(u => u.Phone)
                   .HasColumnName("phone")
                   .HasMaxLength(20);

            builder.Property(u => u.Address)
                   .HasColumnName("address")
                   .HasMaxLength(500);

            builder.Property(u => u.CreatedAt)
                   .HasColumnName("created_at")
                   .HasDefaultValueSql("NOW()");
        }
    }
}