using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Eatzie.Models
{
    public class OrderDetailEntity
    {
        public int Id { get; set; }
        [JsonIgnore]
        public int OrderId { get; set; }
        [Column("FoodId")]

        public int FoodId { get; set; }

        public int Quantity { get; set; }

        public decimal UnitPrice { get; set; }

        public string? Note { get; set; }

        // Navigation
        public OrderEntity? Order { get; set; }

        public FoodEntity? Food { get; set; }
    }
}