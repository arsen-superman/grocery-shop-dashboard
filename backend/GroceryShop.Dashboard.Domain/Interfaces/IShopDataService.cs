using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using GroceryShop.Dashboard.Domain.DTOs;

namespace GroceryShop.Dashboard.Domain.Interfaces
{
    public interface IShopDataService
    {
        Task<IEnumerable<DailyRevenueSummaryDto>> GetDailyRevenueData(
            int shopId,
            DateTime fromDate,
            DateTime toDate);
    }
}
