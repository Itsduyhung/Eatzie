using Eatzie.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Eatzie.Data.Configuration
{
    public class PasswordResetTokenConfiguration : IEntityTypeConfiguration<PasswordResetToken>
    {
        public void Configure(EntityTypeBuilder<PasswordResetToken> builder)
        {
            builder.ToTable("password_reset_tokens");

            builder.HasKey(t => t.Id);

            builder.Property(t => t.Id)
                   .HasColumnName("id");

            builder.Property(t => t.Otp)
                   .HasColumnName("otp")
                   .HasMaxLength(10);

            builder.Property(t => t.OtpExpiresAt)
                   .HasColumnName("otp_expires_at");

            builder.Property(t => t.ResetToken)
                   .HasColumnName("reset_token");

            builder.Property(t => t.ResetTokenExpiresAt)
                   .HasColumnName("reset_token_expires_at");

            builder.Property(t => t.CreatedAt)
                   .HasColumnName("created_at")
                   .IsRequired()
                   .HasDefaultValueSql("NOW()");

            builder.Property(t => t.UserId)
                   .HasColumnName("user_id")
                   .IsRequired();

            builder.HasOne(t => t.User)
                   .WithMany(u => u.PasswordResetTokens) 
                   .HasForeignKey(t => t.UserId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}