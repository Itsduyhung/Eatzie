using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Eatzie.Models
{
    [Table("users")]
    public class UserEntity
    {
        [Key]
        [Column("Id")]
        public int Id { get; set; }

        [Column("fullname")]
        [MaxLength(255)]
        public string? Fullname { get; set; }

        [Column("avatar")]
        [MaxLength(1000)]
        public string? Avatar { get; set; }

        [Required]
        [Column("email")]
        [MaxLength(255)]
        public required string Email { get; set; }

        [Required]
        [Column("password")]
        [MaxLength(255)]
        public required string Password { get; set; }

        [Column("phone")] 
        [MaxLength(20)]
        public string? Phone { get; set; }

        [Column("address")]
        [MaxLength(500)]
        public string? Address { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public virtual ICollection<PasswordResetToken> PasswordResetTokens { get; set; } = [];
        [InverseProperty("User")]
        public ICollection<SavedFoodEntity> SavedFoods { get; set; } = new List<SavedFoodEntity>();
        public ICollection<UserDietEntity>? UserDiets { get; set; }
        public ICollection<HistoryFoodEntity> HistoryFoods { get; set; }
        public ICollection<FeedbackEntity> Feedbacks { get; set; }
        public ICollection<FoodViewEntity> FoodViews { get; set; }
    }
}