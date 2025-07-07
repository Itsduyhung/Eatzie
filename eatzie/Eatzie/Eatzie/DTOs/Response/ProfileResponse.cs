namespace Eatzie.DTOs.Response
{
    public class ProfileResponse
    {
        public int Id { get; set; }
        public string? Fullname { get; set; }
        public string Email { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public string? Avatar { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}