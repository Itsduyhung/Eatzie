namespace Eatzie.DTOs.Request
{
    // Represents a single cart item in the batch payload
    public class AddToCartItemRequest
    {
        public int FoodId { get; set; }
        public int Quantity { get; set; }
    }

    // Represents an array payload for adding multiple items at once
    public class AddToCartBatchRequest
    {
        public List<AddToCartItemRequest> Items { get; set; } = new();
    }
}