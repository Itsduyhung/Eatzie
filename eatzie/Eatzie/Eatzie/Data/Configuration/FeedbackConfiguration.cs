using Eatzie.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Eatzie.Data.Configuration
{
    public class FeedbackConfiguration : IEntityTypeConfiguration<FeedbackEntity>
    {
        public void Configure(EntityTypeBuilder<FeedbackEntity> builder)
        {
            builder.ToTable("feedbacks");
            builder.HasKey(f => f.Id);

            builder.Property(f => f.Content).IsRequired();
            builder.Property(f => f.Rating).IsRequired();
            builder.Property(f => f.IsResolved).HasDefaultValue(false);
            builder.Property(f => f.CreatedAt).HasDefaultValueSql("NOW()");

            builder.HasOne(f => f.User)
                   .WithMany(u => u.Feedbacks)
                   .HasForeignKey(f => f.UserId);

            builder.HasOne(f => f.Food)
                   .WithMany(f => f.Feedbacks)
                   .HasForeignKey(f => f.Food_id);
        }
    }
}