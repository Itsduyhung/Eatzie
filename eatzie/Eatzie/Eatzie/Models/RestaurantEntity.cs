using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Eatzie.Models;

namespace Eatzie.Models;

public class RestaurantEntity
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public string Status { get; set; } = "Closed";
    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public UserEntity User { get; set; } = null!;
    public ICollection<RestaurantFoodEntity> RestaurantFoods { get; set; } = new List<RestaurantFoodEntity>();
}