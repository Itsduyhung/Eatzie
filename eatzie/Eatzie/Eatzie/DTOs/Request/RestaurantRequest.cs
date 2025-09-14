namespace Eatzie.DTOs.Request
{
    public class RestaurantRequest
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public IFormFile? ImageUrl { get; set; }
        public string? Status { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
    }
}