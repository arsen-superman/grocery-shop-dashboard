using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using GroceryShop.Dashboard.Domain.Entities;

namespace GroceryShop.Dashboard.Infrastructure.Data
{
    public static class DataSeeder
    {
        public static async Task SeedAsync(ShopDbContext context, ILogger logger)
        {
            if (await context.Shops.AnyAsync())
            {
                logger.LogInformation("Database already contains data. Skipping seed.");
                return;
            }

            logger.LogInformation("Starting database seeding...");

            var now = DateTime.UtcNow;

            var shops = new List<Shop>
            {
                new() {
                    ShopId = 1,
                    Name = "Shop 1",
                    IsActive = true,
                    CreatedAt = now,
                    ModifiedAt = now
                },
                new() {
                    ShopId = 2,
                    Name = "Shop 2",
                    IsActive = true,
                    CreatedAt = now,
                    ModifiedAt = now
                },
                new() {
                    ShopId = 3,
                    Name = "Shop 3",
                    IsActive = true,
                    CreatedAt = now,
                    ModifiedAt = now
                }
            };

            await context.Shops.AddRangeAsync(shops);
            await context.SaveChangesAsync();

            logger.LogInformation("Seeded {Count} shops", shops.Count);

            var random = new Random(42); 
            var records = new List<DailyRevenueSummary>();

            var startDate = new DateTime(2021, 01, 1);
            var endDate = new DateTime(2025, 10, 31);

            foreach (var shop in shops)
            {
                for (var date = startDate; date <= endDate; date = date.AddDays(1))
                {
                    var income = random.Next(5000, 15001); // 5000-15000
                    var outcome = random.Next(3000, 10001); // 3000-10000

                    records.Add(new DailyRevenueSummary
                    {
                        ShopId = shop.ShopId,
                        Date = date,
                        DailyIncome = income,
                        DailyOutcome = outcome
                    });
                }
            }

            await context.DailyRevenueSummaries.AddRangeAsync(records);
            await context.SaveChangesAsync();

            logger.LogInformation(
                "Seeded {Count} daily revenue records for October 2025",
                records.Count);

            logger.LogInformation("Database seeding completed successfully!");
        }
    }
}
