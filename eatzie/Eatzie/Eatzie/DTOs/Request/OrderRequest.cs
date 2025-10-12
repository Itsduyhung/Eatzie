namespace Eatzie.DTOs.Request
{
    public class CreateOrderRequest
    {
        public decimal TotalPrice { get; set; }
        public string Note { get; set; }
    }
}