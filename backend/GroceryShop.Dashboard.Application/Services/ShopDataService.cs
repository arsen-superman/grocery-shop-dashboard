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
            var query = _context.DailyRevenueSummaries
                .Where(r => r.Date >= fromDate && r.Date <= toDate);

            if (shopId != default)
            {
                query = query.Where(r => r.ShopId == shopId);
            }

            var data = await query
                .OrderBy(r => r.Date)
                .Select(r => new DailyRevenueSummaryDto(
                    r.Date,
                    r.DailyIncome,
                    r.DailyOutcome,
                    r.Revenue
                ))
                .AsNoTracking()
                .ToListAsync();

            return data;
        }
    }
}
