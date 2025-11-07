using System;
using GroceryShop.Dashboard.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace GroceryShop.Dashboard.Infrastructure.Configuration
{
    public static class DatabaseConfiguration
    {
        public static IServiceCollection ConfigureDatabase(
        this IServiceCollection services,
        IConfiguration configuration)
        {
            var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

            if (environment == "Development" || environment == "local" || string.IsNullOrEmpty(environment))
            {
                var connectionString = configuration.GetConnectionString("DefaultConnection")
                    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found");

                services.AddDbContext<ShopDbContext>(options =>
                    options.UseSqlite(connectionString, sqlOptions =>
                    {
                        sqlOptions.MigrationsAssembly("GroceryShop.Dashboard.Infrastructure");
                    }));
            }
            else
            {
                throw new InvalidOperationException(
                    $"No database provider configured for environment: {environment}");
            }

            return services;
        }
    }
}
