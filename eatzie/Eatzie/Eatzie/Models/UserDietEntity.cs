using Eatzie.Enum;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Eatzie.Models
{
    public class UserDietEntity
    {
        [Key]
        [Column("Id")]
        public int Id { get; set; }

        public int UserId { get; set; }

        public string? Allergic_food { get; set; }

        public string? Favorite_food { get; set; }
        public decimal? Min_spending { get; set; }
        public decimal? Max_spending { get; set; }
        public DietTypeEnum Diet_type { get; set; }

        // Navigation
        public ICollection<UserDietFoodEntity>? UserDietFoods { get; set; }
        [ForeignKey("UserId")]
        [InverseProperty("UserDiets")]
        public UserEntity? User { get; set; }
    }
}