using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Eatzie.Models;

public class FoodCategoryItemEntity
{
    [Column(Order = 0)]
    public int CategoryId { get; set; }
    [Column(Order = 1)]
    public int FoodId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public FoodCategoryEntity Category { get; set; } = null!;
    public FoodEntity Food { get; set; } = null!;
}