using System.ComponentModel.DataAnnotations;

namespace Eatzie.DTOs.Request
{
    public class ForgotPasswordRequestDto
    {
        [Required(ErrorMessage = "Email không được để trống.")]
        [EmailAddress(ErrorMessage = "Định dạng email không hợp lệ.")]
        public string Email { get; set; } = string.Empty;
    }
}