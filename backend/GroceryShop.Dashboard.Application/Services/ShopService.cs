using Microsoft.Extensions.Logging;
using GroceryShop.Dashboard.Domain.Interfaces;
using GroceryShop.Dashboard.Infrastructure.Data;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using GroceryShop.Dashboard.Domain.DTOs;
using System.Linq;
using System.Collections.Generic;

namespace GroceryShop.Dashboard.Application.Services
{
    public class ShopService : IShopService
    {
        private readonly ShopDbContext _context;
        private readonly ILogger<ShopService> _logger;

        public ShopService(ShopDbContext context, ILogger<ShopService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<ShopInfoDto> GetShopInfo(int shopId)
        {
            var shop = await _context.Shops
                .Where(s => s.ShopId == shopId && s.IsActive)
                .Select(s => new ShopInfoDto(s.ShopId, s.Name))
                .AsNoTracking()
                .FirstOrDefaultAsync();

            if (shop == null)
            {
                _logger.LogWarning("Shop not found or inactive for TenantId: {TenantId}", shopId);
            }

            return shop;
        }

        public async Task<List<ShopInfoDto>> GetAll()
        {
            var shops = await _context.Shops
                .Select(s => new ShopInfoDto(s.ShopId, s.Name))
                .AsNoTracking()
                .ToListAsync();
            if (shops.Count == 0)
            {
                _logger.LogWarning("No shops found in the database.");
            }

            return shops;
        }
    }
}
