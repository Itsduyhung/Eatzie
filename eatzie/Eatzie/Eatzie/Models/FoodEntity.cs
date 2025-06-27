using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Eatzie.Models
{
    public class FoodEntity
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string? Content { get; set; }

        public string? Description { get; set; }

        public string? ImageUrl { get; set; }

        [Required]
        public bool IsVegetarian { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public ICollection<UserDietFoodEntity>? UserDietFoods { get; set; }
        public ICollection<HistoryFoodEntity>? HistoryFoods { get; set; }
    }
}