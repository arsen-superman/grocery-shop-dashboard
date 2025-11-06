using System;
using System.Linq;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using GroceryShop.Dashboard.Domain.Interfaces;
using GroceryShop.Dashboard.API.Models;

namespace GroceryShop.Dashboard.API.Controllers
{
    [ApiController]
    [Route("api/shop-data")]
    public class ShopDataController : ControllerBase
    {
        private readonly ITenantService _tenantService;
        private readonly IShopDataService _shopDataService;
        private readonly ILogger<ShopDataController> _logger;

        public ShopDataController(
            ITenantService tenantService,
            IShopDataService shopDataService,
            ILogger<ShopDataController> logger)
        {
            _tenantService = tenantService;
            _shopDataService = shopDataService;
            _logger = logger;
        }

        /// <summary>
        /// Get daily revenue data for a shop within date range
        /// </summary>
        /// <param name="tenantId">Shop identifier</param>
        /// <param name="fromDate">Start date (inclusive)</param>
        /// <param name="toDate">End date (inclusive)</param>
        /// <returns>Shop information and revenue data</returns>
        [HttpGet]
        [ProducesResponseType(typeof(RevenueDataResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetRevenueData(
            [FromQuery][Required] int tenantId,
            [FromQuery][Required] DateTime fromDate,
            [FromQuery][Required] DateTime toDate)
        {
            try
            {
                if (fromDate > toDate)
                {
                    _logger.LogWarning(
                        "Invalid date range: fromDate ({FromDate}) is after toDate ({ToDate})",
                        fromDate, toDate);
                    return BadRequest(new { error = "fromDate cannot be after toDate" });
                }

                var shopInfo = await _tenantService.GetShopInfo(tenantId);
                if (shopInfo == null)
                {
                    _logger.LogWarning("Tenant {TenantId} not found or inactive", tenantId);
                    return NotFound(new { error = $"Shop with tenantId {tenantId} not found or inactive" });
                }

                var data = await _shopDataService.GetDailyRevenueData(tenantId, fromDate, toDate);

                var response = new RevenueDataResponse(
                    shopInfo.TenantId,
                    shopInfo.ShopName,
                    data
                );

                _logger.LogInformation(
                    "Successfully retrieved {Count} records for tenant {TenantId} ({ShopName})",
                    data.Count(), tenantId, shopInfo.ShopName);

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex,
                    "Error retrieving revenue data for tenant {TenantId}",
                    tenantId);
                return StatusCode(500, new { error = "An error occurred while processing your request" });
            }
        }
    }
}
