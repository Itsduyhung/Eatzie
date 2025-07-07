using Eatzie.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Eatzie.Data.Configuration
{
    public class UserDietConfiguration : IEntityTypeConfiguration<UserDietEntity>
    {
        public void Configure(EntityTypeBuilder<UserDietEntity> builder)
        {
            builder.ToTable("userdiet");

            builder.HasKey(ud => ud.Id);

            builder.Property(ud => ud.Diet_type)
                   .HasConversion<string>()
                   .IsRequired();

            builder.HasMany(ud => ud.UserDietFoods)
                   .WithOne(udf => udf.UserDiet)
                   .HasForeignKey(udf => udf.UserDiet_id);
        }
    }
}