using Eatzie.Helpers;
using Eatzie.DTOs.Response;
using Eatzie.DTOs.Request;

namespace Eatzie.Interfaces.IService
{
    public interface ICartService
    {
        Task<BaseAPIResponse> AddToCartAsync(int userId, int foodId, int quantity);
        Task<BaseAPIResponse> AddToCartRangeAsync(int userId, List<AddToCartItemRequest> items);
        Task<BaseAPIResponse> RemoveFromCartAsync(int userId, int foodId);
        Task<BaseAPIResponse> ClearCartAsync(int userId);
        //Task<BaseAPIResponse> PlaceOrderAsync(int userId);
        Task<List<CartItemResponse>> GetCartItemsAsync(int userId);
    }
}