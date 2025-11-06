using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using GroceryShop.Dashboard.Domain.DTOs;
using GroceryShop.Dashboard.Domain.Interfaces;
using GroceryShop.Dashboard.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GroceryShop.Dashboard.Application.Services
{
    public class ShopDataService : IShopDataService
    {
        private readonly ShopDbContext _context;
        private readonly ILogger<ShopDataService> _logger;

        public ShopDataService(
            ShopDbContext context,
            ILogger<ShopDataService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<DailyRevenueSummaryDto>> GetDailyRevenueData(
            int tenantId,
            DateTime fromDate,
            DateTime toDate)
        {
            var data = await _context.DailyRevenueSummaries
                .Where(r => r.TenantId == tenantId
                         && r.Date >= fromDate
                         && r.Date <= toDate)
                .OrderBy(r => r.Date)
                .Select(r => new DailyRevenueSummaryDto(
                    r.Date,
                    r.DailyIncome,
                    r.DailyOutcome,
                    r.Revenue
                ))
                .ToListAsync();

            return data;
        }
    }
}
