namespace Eatzie.DTOs.Response
{
    public class FoodResponse
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }
        public bool IsVegetarian { get; set; }
        public int TotalViews { get; set; }
        public double AverageRating { get; set; }
        public string? Address { get; set; }
        public double Value { get; set; }
        public decimal Price { get; set; }
        }
}