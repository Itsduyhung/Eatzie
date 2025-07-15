using System.ComponentModel.DataAnnotations.Schema;

namespace Eatzie.Models
{
    public class CartItemEntity
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public int FoodId { get; set; }

        public int Quantity { get; set; }

        public DateTime AddedAt { get; set; }

        // Navigation
        public UserEntity? User { get; set; }
        public FoodEntity? Food { get; set; }
    }
}