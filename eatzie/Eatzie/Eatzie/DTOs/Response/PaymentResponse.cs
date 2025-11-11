namespace Eatzie.DTOs.Response
{
    public class PaymentResponse
    {
        public int PaymentId { get; set; }
        public int OrderId { get; set; }
        public string PaymentLink { get; set; } = string.Empty;
        public string PayOSCode { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? PaidAt { get; set; }
        // QR code dưới dạng base64 string từ PayOS API
        // Format: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
        public string? QrCode { get; set; }
    }
}
