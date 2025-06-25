using System.ComponentModel.DataAnnotations;

namespace Eatzie.DTOs.Request
{
    public class SignUpRequest
    {
        [Required(ErrorMessage = "Họ và tên không được để trống.")]
        [MaxLength(255, ErrorMessage = "Họ và tên không được vượt quá 255 ký tự.")]
        public string Fullname { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email không được để trống.")]
        [EmailAddress(ErrorMessage = "Định dạng email không hợp lệ.")]
        [MaxLength(255, ErrorMessage = "Email không được vượt quá 255 ký tự.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Mật khẩu không được để trống.")]
        [MinLength(6, ErrorMessage = "Mật khẩu phải có ít nhất 6 ký tự.")]
        [MaxLength(255, ErrorMessage = "Mật khẩu không được vượt quá 255 ký tự.")]
        public string Password { get; set; } = string.Empty;

        [Required(ErrorMessage = "Xác nhận mật khẩu không được để trống.")]
        [Compare("Password", ErrorMessage = "Mật khẩu và xác nhận mật khẩu không khớp.")]
        public string ConfirmPassword { get; set; } = string.Empty;
    }
}