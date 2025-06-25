using System.ComponentModel.DataAnnotations;

namespace Eatzie.DTOs.Request
{
    public class ResetPasswordRequest
    {
        [Required(ErrorMessage = "Reset token không được để trống.")]
        public string ResetToken { get; set; } = string.Empty;

        [Required(ErrorMessage = "Mật khẩu mới không được để trống.")]
        [MinLength(6, ErrorMessage = "Mật khẩu phải có ít nhất 6 ký tự.")]
        public string NewPassword { get; set; } = string.Empty;

        [Required(ErrorMessage = "Xác nhận mật khẩu không được để trống.")]
        [Compare("NewPassword", ErrorMessage = "Mật khẩu mới và xác nhận mật khẩu không khớp.")]
        public string ConfirmPassword { get; set; } = string.Empty;
    }
}