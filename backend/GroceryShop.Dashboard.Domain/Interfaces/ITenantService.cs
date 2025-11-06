using System.Threading.Tasks;

namespace GroceryShop.Dashboard.Domain.Interfaces
{
    internal interface ITenantService
    {
        int GetCurrentTenantId();
        Task<bool> ValidateTenant(int tenantId);
    }
}
