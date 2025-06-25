namespace Eatzie.DTOs.Response
{
    public class SignInResponse
    {
        public int UserId { get; set; }
        public string? Fullname { get; set; }
        public string? Email { get; set; }
        public string Message { get; set; } = "Đăng nhập thành công!";
    }
}