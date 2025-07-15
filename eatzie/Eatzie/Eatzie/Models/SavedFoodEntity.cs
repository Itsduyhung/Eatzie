using Eatzie.Models;

public class SavedFoodEntity
{
    public int Id { get; set; }

    public int UserId { get; set; }
    public int FoodId { get; set; }
    public DateTime SavedAt { get; set; }

    // Navigation
    public UserEntity? User { get; set; }
    public FoodEntity? Food { get; set; }
}