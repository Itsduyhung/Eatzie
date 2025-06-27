namespace Eatzie.DTOs.Response;
public class UserDietResponse
{
    public int UserDietId { get; set; }
    public int UserId { get; set; }
    public string? Allergic_food { get; set; }
    public string? Favorite_food { get; set; }
    public decimal? Min_spending { get; set; }
    public decimal? Max_spending { get; set; }
    public int Diet_type { get; set; }
}