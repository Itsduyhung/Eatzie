using Eatzie.Models;
using System.Text.Json.Serialization;

namespace Eatzie.DTOs.Response;

public class RestaurantResponse
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string Address { get; set; }
    public string PhoneNumber { get; set; }
    public string ImageUrl { get; set; }
    public DateTime CreatedAt { get; set; }
    public string OperatingHours { get; set; }
    public string CloseTime { get; set; }
    public string Status { get; set; }
    public List<FoodBriefResponse> RestaurantFoods { get; set; }

    public List<FoodCategoryDto> FoodCategories { get; set; }
}