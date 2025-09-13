using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Eatzie.Models;

public class RestaurantFoodEntity
{
    [Column(Order = 0)]
    public int RestaurantId { get; set; }
    [Column(Order = 1)]
    public int FoodId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public RestaurantEntity Restaurant { get; set; } = null!;
    public FoodEntity Food { get; set; } = null!;
}