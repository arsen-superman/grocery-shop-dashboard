using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using GroceryShop.Dashboard.Domain.Entities;

namespace GroceryShop.Dashboard.Infrastructure.Data.EntityConfigurations
{
    public class DailyRevenueSummaryConfiguration : IEntityTypeConfiguration<DailyRevenueSummary>
    {
        public void Configure(EntityTypeBuilder<DailyRevenueSummary> builder)
        {
            builder.HasKey(r => r.Id);

            builder.Property(r => r.TenantId)
                .IsRequired();

            builder.Property(r => r.Date)
                .IsRequired()
                .HasColumnType("date");

            builder.Property(r => r.DailyIncome)
                .IsRequired()
                .HasColumnType("decimal(18,2)");

            builder.Property(r => r.DailyOutcome)
                .IsRequired()
                .HasColumnType("decimal(18,2)");

            builder.Ignore(r => r.Revenue);

            builder.HasIndex(r => new { r.TenantId, r.Date });

            builder.HasIndex(r => new { r.TenantId, r.Date })
                .IsUnique();
        }
    }
}
