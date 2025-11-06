using System;

namespace GroceryShop.Dashboard.Domain.DTOs
{
    public record DailyRevenueSummaryDto(
        DateTime Date,
        decimal Income,
        decimal Outcome,
        decimal Revenue
    );
}
