using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GroceryShop.Dashboard.Domain.DTOs;
using GroceryShop.Dashboard.Domain.Interfaces;
using GroceryShop.Dashboard.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GroceryShop.Dashboard.Application.Services
{
    public class ShopDataService : IShopDataService
    {
        private readonly ShopDbContext _context;

        public ShopDataService(ShopDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<DailyRevenueSummaryDto>> GetDailyRevenueData(int shopId, DateTime fromDate, DateTime toDate)
        {
            if (shopId == default)
            {
                var allData = await _context.DailyRevenueSummaries
                    .Where(r => r.Date >= fromDate && r.Date <= toDate)
                    .AsNoTracking()
                    .ToListAsync();

                var aggregatedData = allData
                    .GroupBy(r => r.Date)
                    .Select(g => new DailyRevenueSummaryDto(
                        g.Key,
                        g.Sum(r => r.DailyIncome),
                        g.Sum(r => r.DailyOutcome),
                        g.Sum(r => r.DailyIncome - r.DailyOutcome)
                    ))
                    .OrderBy(r => r.Date)
                    .ToList();

                return aggregatedData;
            }

            var data = await _context.DailyRevenueSummaries
                .Where(r => r.ShopId == shopId
                         && r.Date >= fromDate
                         && r.Date <= toDate)
                .OrderBy(r => r.Date)
                .Select(r => new DailyRevenueSummaryDto(
                    r.Date,
                    r.DailyIncome,
                    r.DailyOutcome,
                    r.DailyIncome - r.DailyOutcome
                ))
                .AsNoTracking()
                .ToListAsync();

            return data;
        }
    }
}
