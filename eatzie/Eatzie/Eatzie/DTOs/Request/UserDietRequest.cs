using Eatzie.Enum;

namespace Eatzie.DTOs.Request
{
    public class UserDietRequest
    {
        public int UserId { get; set; }

        public string? AllergicFood { get; set; }

        public string? FavoriteFood { get; set; }

        public decimal? MinSpending { get; set; }

        public decimal? MaxSpending { get; set; }

        public DietTypeEnum? DietType { get; set; }
    }
}