using System;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using GroceryShop.Dashboard.Domain.Interfaces;
using GroceryShop.Dashboard.API.Models;
using GroceryShop.Dashboard.Domain.DTOs;
using System.Collections.Generic;

namespace GroceryShop.Dashboard.API.Controllers
{
    [ApiController]
    [Route("api/shop")]
    public class ShopController : ControllerBase
    {
        private readonly IShopService _shopService;
        private readonly IShopDataService _shopDataService;
        private readonly ILogger<ShopController> _logger;

        public ShopController(
            IShopService shopService,
            IShopDataService shopDataService,
            ILogger<ShopController> logger)
        {
            _shopService = shopService;
            _shopDataService = shopDataService;
            _logger = logger;
        }

        /// <summary>
        /// Retrieves all active shops.
        /// </summary>
        /// <returns>A list of all active shops with their shop information.</returns>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<ShopInfoDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IEnumerable<ShopInfoDto>>> GetAllShops()
        {
            try
            {
                var shops = await _shopService.GetAll();
                return Ok(shops);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving all shops");
                return StatusCode(500, new { message = "An error occurred while retrieving shops" });
            }
        }

        /// <summary>
        /// Get daily revenue data for a shop within date range
        /// </summary>
        /// <param name="shopId">Shop identifier</param>
        /// <param name="fromDate">Start date (inclusive)</param>
        /// <param name="toDate">End date (inclusive)</param>
        /// <returns>Shop information and revenue data</returns>
        [HttpGet("{shopId}/revenue")]
        [ProducesResponseType(typeof(RevenueDataResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetRevenueData(
            int shopId,
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

                var shopInfo = await _shopService.GetShopInfo(shopId);
                if (shopInfo == null)
                {
                    _logger.LogWarning("Shop {ShopId} not found or inactive", shopId);
                    return NotFound(new { error = $"Shop with shopId {shopId} not found or inactive" });
                }

                var data = await _shopDataService.GetDailyRevenueData(shopId, fromDate, toDate);

                var response = new RevenueDataResponse(
                    shopInfo.ShopId,
                    shopInfo.Name,
                    data
                );

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex,
                    "Error retrieving revenue data for shop {ShopId}",
                    shopId);
                return StatusCode(500, new { error = "An error occurred while processing your request" });
            }
        }
    }
}
