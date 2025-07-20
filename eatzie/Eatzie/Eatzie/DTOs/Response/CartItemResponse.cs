namespace Eatzie.DTOs.Response
{
    public class CartItemResponse
    {
        public int FoodId { get; set; }
        public string FoodName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public string? ImageUrl { get; set; }
        public decimal Price { get; set; }
    }
}