using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Eatzie.Models
{
    [Table("notifications")]
    public class NotificationEntity
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("user_id")]
        public int UserId { get; set; }

        [Column("title")]
        [MaxLength(255)]
        public string Title { get; set; } = string.Empty;

        [Column("content")]
        [MaxLength(1000)]
        public string Content { get; set; } = string.Empty;

        [Column("type")]
        [MaxLength(50)]
        public string Type { get; set; } = "info"; // info, success, warning, error

        [Column("is_read")]
        public bool IsRead { get; set; } = false;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("avatar_url")]
        [MaxLength(1000)]
        public string? AvatarUrl { get; set; }

        // Navigation property
        [ForeignKey("UserId")]
        public virtual UserEntity? User { get; set; }
    }
}

