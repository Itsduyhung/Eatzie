using Newtonsoft.Json;

namespace Eatzie.DTOs.Request
{
    public class CreatePaymentRequest
    {
        [JsonProperty("orderId")]
        public int OrderId { get; set; }
        
        [JsonProperty("amount")]
        public decimal Amount { get; set; }
        
        [JsonProperty("description")]
        public string Description { get; set; } = "Payment for order";
        
        [JsonProperty("returnUrl")]
        public string? ReturnUrl { get; set; }
        
        [JsonProperty("cancelUrl")]
        public string? CancelUrl { get; set; }
    }
}

