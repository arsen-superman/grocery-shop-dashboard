using GroceryShop.Dashboard.Domain.DTOs;
using System.Threading.Tasks;

namespace GroceryShop.Dashboard.Domain.Interfaces
{
    public interface ITenantService
    {
        Task<ShopInfoDto> GetShopInfo(int tenantId);
    }
}
