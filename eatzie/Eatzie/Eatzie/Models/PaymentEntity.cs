using System.ComponentModel.DataAnnotations;

namespace Eatzie.Models
{
    public class PaymentEntity
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public string PaymentLink { get; set; } = string.Empty;
        public string PayOSCode { get; set; } = string.Empty;
        public string Status { get; set; } = "PENDING"; // PENDING, PAID, CANCELLED
        public DateTime CreatedAt { get; set; }
        public DateTime? PaidAt { get; set; }
        public decimal Amount { get; set; }
        
        // Navigation
        public OrderEntity? Order { get; set; }
    }
}




