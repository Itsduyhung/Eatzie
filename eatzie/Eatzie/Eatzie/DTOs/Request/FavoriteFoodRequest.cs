namespace Eatzie.DTOs.Request
{
    public class FavoriteFoodRequest
    {
        public int UserId { get; set; }
        public string FavoriteFood { get; set; } = string.Empty;
    }
}