namespace Eatzie.DTOs.Request
{
    public class ProfileRequest
    {
        public string? Fullname { get; set; }
        //public string? Password { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public IFormFile? Avatar { get; set; }
    }
}