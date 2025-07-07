using Eatzie.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Eatzie.Data.Configuration
{
    public class HistoryFoodConfiguration : IEntityTypeConfiguration<HistoryFoodEntity>
    {
        public void Configure(EntityTypeBuilder<HistoryFoodEntity> builder)
        {
            builder.ToTable("historyfood");
            builder.HasKey(h => h.Id);

            builder.HasOne(h => h.User)
                   .WithMany(u => u.HistoryFoods)
                   .HasForeignKey(h => h.UserId);

            builder.HasOne(h => h.Food)
                   .WithMany(f => f.HistoryFoods)
                   .HasForeignKey(h => h.Food_id);
        }
    }
}