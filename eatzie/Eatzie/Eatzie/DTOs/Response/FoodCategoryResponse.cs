namespace Eatzie.DTOs.Response;
public class FoodCategoryDto
{
    public string CategoryName { get; set; } = string.Empty;
    public List<FoodResponse> Foods { get; set; } = new List<FoodResponse>();
}