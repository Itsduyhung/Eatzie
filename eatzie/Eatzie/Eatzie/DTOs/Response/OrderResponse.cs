namespace Eatzie.DTOs.Response
{
    public class OrderResponse
    {
        public int OrderId { get; set; }
        public DateTime CreatedAt { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; }
        public List<OrderItemResponse> Items { get; set; } = new();
    }
}