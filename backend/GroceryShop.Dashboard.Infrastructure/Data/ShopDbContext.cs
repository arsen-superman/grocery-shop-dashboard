using Microsoft.EntityFrameworkCore;
using GroceryShop.Dashboard.Domain.Entities;


namespace GroceryShop.Dashboard.Infrastructure.Data
{
    public class ShopDbContext(DbContextOptions<ShopDbContext> options) : DbContext(options)
    {
        public DbSet<Shop> Shops => Set<Shop>();
        public DbSet<DailyRevenueSummary> DailyRevenueSummaries => Set<DailyRevenueSummary>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Apply configurations
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(ShopDbContext).Assembly);
        }
    }
}
