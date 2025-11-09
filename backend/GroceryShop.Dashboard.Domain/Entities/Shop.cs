using System;
using System.Collections.Generic;

namespace GroceryShop.Dashboard.Domain.Entities
{
    public class Shop
    {
        public int ShopId { get; set; }
        public string ShopName { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime ModifiedAt { get; set; }

        public ICollection<DailyRevenueSummary> DailyRecords { get; set; } = new List<DailyRevenueSummary>();
    }
}
