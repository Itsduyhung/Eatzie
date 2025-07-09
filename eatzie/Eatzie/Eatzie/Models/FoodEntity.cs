using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Eatzie.Models
{
    public class FoodEntity
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }
        public bool IsVegetarian { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? Address { get; set; }

        // Navigation
        public ICollection<HistoryFoodEntity> HistoryFoods { get; set; }
        public ICollection<FeedbackEntity> Feedbacks { get; set; }
        public ICollection<FoodViewEntity> FoodViews { get; set; }
        public ICollection<UserDietFoodEntity> UserDietFoods { get; set; }
    }
}