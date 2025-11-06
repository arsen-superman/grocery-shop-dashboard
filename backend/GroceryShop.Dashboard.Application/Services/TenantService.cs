using Microsoft.Extensions.Logging;
using GroceryShop.Dashboard.Domain.Interfaces;
using GroceryShop.Dashboard.Infrastructure.Data;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using GroceryShop.Dashboard.Domain.DTOs;
using System.Linq;

namespace GroceryShop.Dashboard.Application.Services
{
    public class TenantService : ITenantService
    {
        private readonly ShopDbContext _context;
        private readonly ILogger<TenantService> _logger;

        public TenantService(ShopDbContext context, ILogger<TenantService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<ShopInfoDto> GetShopInfo(int tenantId)
        {
            var shop = await _context.Shops
                .Where(s => s.TenantId == tenantId && s.IsActive)
                .Select(s => new ShopInfoDto(s.TenantId, s.ShopName))
                .FirstOrDefaultAsync();

            if (shop == null)
            {
                _logger.LogWarning("Shop not found or inactive for TenantId: {TenantId}", tenantId);
            }

            return shop;
        }
    }
}
