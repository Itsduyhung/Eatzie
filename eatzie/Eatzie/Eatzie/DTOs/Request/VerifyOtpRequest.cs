using System.ComponentModel.DataAnnotations;

namespace Eatzie.DTOs.Request 
{
    /// <summary>
    /// DTO này dùng để nhận dữ liệu khi người dùng gửi yêu cầu xác thực OTP.
    /// </summary>
    public class VerifyOtpRequest
    {
        [Required(ErrorMessage = "Email không được để trống.")]
        [EmailAddress(ErrorMessage = "Định dạng email không hợp lệ.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "OTP không được để trống.")]
        [StringLength(6, MinimumLength = 6, ErrorMessage = "OTP phải có đúng 6 chữ số.")]
        public string Otp { get; set; } = string.Empty;
    }
}