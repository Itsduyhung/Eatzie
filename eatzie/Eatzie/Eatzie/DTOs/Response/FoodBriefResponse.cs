namespace Eatzie.DTOs.Response
{
    public class FoodBriefResponse
    {
        public int Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public bool IsVegetarian { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? RestaurantName { get; set; }
        public int TotalViews { get; set; }
        public double AverageRating { get; set; }
    }
}