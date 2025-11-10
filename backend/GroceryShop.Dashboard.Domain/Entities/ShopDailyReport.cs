using System;

namespace GroceryShop.Dashboard.Domain.Entities
{
    public class ShopDailyReport
    {
        public int Id { get; set; }
        public int ShopId { get; set; }
        public DateTime Date { get; set; }
        public decimal DailyIncome { get; set; }
        public decimal DailyOutcome { get; set; }

        public Shop Shop { get; set; } = null!;
    }
}
