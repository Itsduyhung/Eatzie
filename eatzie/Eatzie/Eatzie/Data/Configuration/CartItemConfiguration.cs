using Eatzie.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class CartItemConfiguration : IEntityTypeConfiguration<CartItemEntity>
{
    public void Configure(EntityTypeBuilder<CartItemEntity> builder)
    {
        builder.ToTable("cart_items");

        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).HasColumnName("Id");
        builder.Property(x => x.UserId).HasColumnName("UserId");
        builder.Property(x => x.FoodId).HasColumnName("FoodId");
        builder.Property(x => x.Quantity).HasColumnName("Quantity");
        builder.Property(x => x.AddedAt).HasColumnName("AddedAt");

        builder.HasOne(x => x.User)
                .WithMany(u => u.CartItems)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Food)
                .WithMany(f => f.CartItems) // THAY ĐỔI: Chỉ định rõ Navigation Property ngược lại trong FoodEntity
                .HasForeignKey(x => x.FoodId); // Foreign key vẫn là FoodId
                                               // .HasConstraintName("FK_cart_items_foods"); // THAY ĐỔI: Xóa dòng này
    }
}