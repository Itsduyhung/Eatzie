namespace Eatzie.DTOs.Response;

public class FoodCategoryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public List<FoodResponse> Foods { get; set; } = new List<FoodResponse>();
}