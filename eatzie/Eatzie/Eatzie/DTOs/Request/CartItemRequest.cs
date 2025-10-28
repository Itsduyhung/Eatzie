using Newtonsoft.Json;

namespace Eatzie.DTOs.Request
{
    // Represents a single cart item in the batch payload
    public class AddToCartItemRequest
    {
        [JsonProperty("foodId")]
        public int FoodId { get; set; }
        
        [JsonProperty("quantity")]
        public int Quantity { get; set; }
    }

    // Represents an array payload for adding multiple items at once
    public class AddToCartBatchRequest
    {
        [JsonProperty("items")]
        public List<AddToCartItemRequest> Items { get; set; } = new();
    }
}