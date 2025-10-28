using Newtonsoft.Json;

namespace Eatzie.DTOs.Request
{
    public class CreateOrderRequest
    {
        [JsonProperty("totalPrice")]
        public decimal TotalPrice { get; set; }
        
        [JsonProperty("note")]
        public string? Note { get; set; }
    }
}