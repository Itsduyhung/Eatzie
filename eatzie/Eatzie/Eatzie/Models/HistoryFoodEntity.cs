using System.ComponentModel.DataAnnotations;

namespace Eatzie.Models
{
    public class HistoryFoodEntity
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public int FoodId { get; set; }

        public DateTime SuggestedAt { get; set; } = DateTime.UtcNow;

        public bool IsSelected { get; set; } = false;

        // Navigation
        public FoodEntity Food { get; set; }
    }
}