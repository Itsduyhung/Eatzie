using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Eatzie.Models
{
    public class FoodEntity
    {
        public int Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public bool IsVegetarian { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? Address { get; set; }
        public decimal Price { get; set; }

        // Navigation
        public ICollection<SavedFoodEntity> SavedByUsers { get; set; } = new List<SavedFoodEntity>();
        public ICollection<HistoryFoodEntity> HistoryFoods { get; set; } = new List<HistoryFoodEntity>();
        public ICollection<FeedbackEntity> Feedbacks { get; set; } = new List<FeedbackEntity>();
        public ICollection<FoodViewEntity> FoodViews { get; set; } = new List<FoodViewEntity>();
        public ICollection<UserDietFoodEntity> UserDietFoods { get; set; } = new List<UserDietFoodEntity>();
        public ICollection<OrderDetailEntity> OrderDetails { get; set; } = new List<OrderDetailEntity>();
        public ICollection<CartItemEntity> CartItems { get; set; } = new List<CartItemEntity>();
        public ICollection<FoodCategoryItemEntity> FoodCategoryItems { get; set; } = new List<FoodCategoryItemEntity>();
        public ICollection<RestaurantFoodEntity> RestaurantFoods { get; set; } = new List<RestaurantFoodEntity>();
    }
}