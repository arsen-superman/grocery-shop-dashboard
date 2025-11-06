using System;
using System.Collections.Generic;

namespace GroceryShop.Dashboard.Domain.Entities
{
    public class Shop
    {
        public int TenantId { get; set; }
        public string ShopName { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<DailyRevenueSummary> DailyRecords { get; set; } = new List<DailyRevenueSummary>();
    }
}
