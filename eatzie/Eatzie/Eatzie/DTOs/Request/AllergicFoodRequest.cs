namespace Eatzie.DTOs.Request
{
    public class AllergicFoodRequest
    {
        public int UserId { get; set; }
        public string Allergic_food { get; set; } = string.Empty;
    }
}