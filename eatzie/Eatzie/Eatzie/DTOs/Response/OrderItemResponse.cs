namespace Eatzie.DTOs.Response
{
    public class OrderItemResponse : CartItemResponse
    {
        public decimal TotalPrice => Price * Quantity;
        public string? Note { get; set; }
    }
}