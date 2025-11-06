using System.Collections.Generic;
using GroceryShop.Dashboard.Domain.DTOs;

namespace GroceryShop.Dashboard.API.Models
{
    public record RevenueDataResponse(
        int TenantId,
        string ShopName,
        IEnumerable<DailyRevenueSummaryDto> Data
    );
}
