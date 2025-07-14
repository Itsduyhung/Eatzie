using Eatzie.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Eatzie.Configurations
{
    public class OrderDetailConfiguration : IEntityTypeConfiguration<OrderDetailEntity>
    {
        public void Configure(EntityTypeBuilder<OrderDetailEntity> builder)
        {
            builder.ToTable("order_details");

            builder.HasKey(od => od.Id);

            builder.Property(od => od.OrderId).IsRequired();
            builder.Property(od => od.FoodId).IsRequired();
            builder.Property(od => od.Quantity).HasDefaultValue(1);
            builder.Property(od => od.UnitPrice).IsRequired();
            builder.Property(od => od.Note).HasMaxLength(255);

            builder.HasOne(od => od.Order)
                   .WithMany(o => o.OrderDetails)
                   .HasForeignKey(od => od.OrderId);

            builder.HasOne(od => od.Food)
                   .WithMany(f => f.OrderDetails)
                   .HasForeignKey(od => od.FoodId);
        }
    }
}