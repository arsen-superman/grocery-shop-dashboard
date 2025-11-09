using System;

namespace GroceryShop.Dashboard.Domain.Entities
{
    public class DailyRevenueSummary
    {
        public int Id { get; set; }
        public int ShopId { get; set; }
        public DateTime Date { get; set; }
        public decimal DailyIncome { get; set; }
        public decimal DailyOutcome { get; set; }

        public decimal Revenue => DailyIncome - DailyOutcome;

        public Shop Shop { get; set; } = null!;
    }
}
