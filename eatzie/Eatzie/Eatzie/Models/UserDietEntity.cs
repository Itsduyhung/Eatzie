using Eatzie.Enum;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Eatzie.Models
{
    public class UserDietEntity
    {
        [Key]
        [Column("UserDietId")]
        public int UserDietId { get; set; }

        public int UserId { get; set; }

        public string? Allergic_food { get; set; }

        public string? Favorite_food { get; set; }

        public decimal? Average_spending { get; set; }

        public DietTypeEnum Diet_type { get; set; }

        // Navigation
        public ICollection<UserDietFoodEntity>? UserDietFoods { get; set; }
        [ForeignKey("UserId")]
        public User? User { get; set; }
        public ICollection<UserDietFoodEntity>? UserDietFoodEntitys { get; set; }
    }
}