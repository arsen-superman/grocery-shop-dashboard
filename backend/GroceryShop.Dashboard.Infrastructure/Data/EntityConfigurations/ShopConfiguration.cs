using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using GroceryShop.Dashboard.Domain.Entities;

namespace GroceryShop.Dashboard.Infrastructure.Data.EntityConfigurations
{
    public class ShopConfiguration : IEntityTypeConfiguration<Shop>
    {
        public void Configure(EntityTypeBuilder<Shop> builder)
        {
            builder.HasKey(s => s.ShopId);

            builder.Property(s => s.ShopId)
                .ValueGeneratedNever();

            builder.Property(s => s.ShopName)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(s => s.IsActive)
                .IsRequired()
                .HasDefaultValue(true);

            builder.Property(s => s.CreatedAt)
                .IsRequired()
                .HasDefaultValueSql("datetime('now')");

            builder.Property(s => s.ModifiedAt)
                .IsRequired()
                .HasDefaultValueSql("datetime('now')");

            builder.HasIndex(s => s.IsActive);

            builder.HasMany(s => s.DailyRecords)
                .WithOne(r => r.Shop)
                .HasForeignKey(r => r.ShopId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
