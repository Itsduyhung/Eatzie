using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Eatzie.Models
{
    [Table("password_reset_tokens")]
    public class PasswordResetToken
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; }

        [Column("otp")]
        [MaxLength(10)]
        public string? Otp { get; set; }

        [Column("otp_expires_at")]
        public DateTime? OtpExpiresAt { get; set; }

        [Column("reset_token")]
        public string? ResetToken { get; set; }

        [Column("reset_token_expires_at")]
        public DateTime? ResetTokenExpiresAt { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // --- Khóa ngoại trỏ đến bảng users ---
        [Required]
        [Column("user_id")]
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; }
    }
}