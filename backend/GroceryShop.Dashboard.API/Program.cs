using GroceryShop.Dashboard.Application.Services;
using GroceryShop.Dashboard.Domain.Interfaces;
using GroceryShop.Dashboard.Infrastructure.Configuration;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
using System;

namespace GroceryShop.Dashboard.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            Log.Logger = new LoggerConfiguration()
            .MinimumLevel.Information()
            .MinimumLevel.Override("Microsoft", Serilog.Events.LogEventLevel.Warning)
            .MinimumLevel.Override("System", Serilog.Events.LogEventLevel.Warning)
            .Enrich.FromLogContext()
            .WriteTo.Console()
            .WriteTo.File(
                path: "logs/log-.txt",
                rollingInterval: RollingInterval.Day,
                outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] {Message:lj}{NewLine}{Exception}")
            .CreateLogger();

            try
            {
                Log.Information("Starting ShopDashboard API");

                var builder = WebApplication.CreateBuilder(args);

                builder.Host.UseSerilog();

                // Configure Database
                builder.Services.ConfigureDatabase(builder.Configuration);

                // Register application services
                builder.Services.AddScoped<ITenantService, TenantService>();
                builder.Services.AddScoped<IShopDataService, ShopDataService>();

                // Configure CORS для Angular
                builder.Services.AddCors(options =>
                {
                    options.AddPolicy("AllowAngular", policy =>
                    {
                        policy.WithOrigins("http://localhost:4200")  // Angular dev server
                              .AllowAnyMethod()
                              .AllowAnyHeader();
                    });
                });

                // Add controllers and API documentation
                builder.Services.AddControllers();
                builder.Services.AddEndpointsApiExplorer();
                builder.Services.AddSwaggerGen(c =>
                {
                    c.SwaggerDoc("v1", new()
                    {
                        Title = "ShopDashboard API",
                        Version = "v1",
                        Description = "API for grocery shop financial dashboard"
                    });
                });

                var app = builder.Build();

                // Apply migrations and seed data at startup
                using (var scope = app.Services.CreateScope())
                {
                    var context = scope.ServiceProvider.GetRequiredService<Infrastructure.Data.ShopDbContext>();

                    Log.Information("Applying database migrations");
                    context.Database.Migrate();

                    // TODO: Add data seeding here later
                    // if (!context.Shops.Any())
                    // {
                    //     DataSeeder.Seed(context);
                    // }

                    Log.Information("Database ready");
                }

                app.UseSerilogRequestLogging(options =>
                {
                    options.MessageTemplate = "HTTP {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed:0.0000} ms";
                    options.EnrichDiagnosticContext = (diagnosticContext, httpContext) =>
                    {
                        diagnosticContext.Set("RequestHost", httpContext.Request.Host.Value);
                        diagnosticContext.Set("UserAgent", httpContext.Request.Headers["User-Agent"].ToString());
                    };
                });

                if (app.Environment.IsDevelopment())
                {
                    app.UseSwagger();
                    app.UseSwaggerUI();
                }

                // Enable CORS
                app.UseCors("AllowAngular");

                app.UseHttpsRedirection();
                app.UseAuthorization();
                app.MapControllers();

                Log.Information("ShopDashboard API started successfully");

                app.Run();
            }
            catch (Exception ex)
            {
                Log.Fatal(ex, "Application terminated unexpectedly");
            }
            finally
            {
                Log.Information("Shutting down ShopDashboard API");
                Log.CloseAndFlush();
            }
        }
    }
}
