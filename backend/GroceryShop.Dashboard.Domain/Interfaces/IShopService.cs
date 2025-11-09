using GroceryShop.Dashboard.Domain.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace GroceryShop.Dashboard.Domain.Interfaces
{
    public interface IShopService
    {
        Task<List<ShopInfoDto>> GetAll();
    }
}
