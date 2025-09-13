using System.ComponentModel.DataAnnotations;

namespace Eatzie.DTOs.Request;

public class FoodCreateRequest
{
    [Required(ErrorMessage = "Tên món ăn là bắt buộc.")]
    public string Content { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    [Required(ErrorMessage = "Giá tiền là bắt buộc.")]
    public decimal Price { get; set; }
    public IFormFile? ImageUrl { get; set; }
    public bool IsVegetarian { get; set; } = false;
    public List<string>? CategoryNames { get; set; }
}

public class FoodUpdateRequest
{
    public string? Content { get; set; }
    public string? Description { get; set; }
    public decimal? Price { get; set; }
    public IFormFile? ImageUrl { get; set; }
    public bool? IsVegetarian { get; set; }
    public List<string>? CategoryNames { get; set; }
}