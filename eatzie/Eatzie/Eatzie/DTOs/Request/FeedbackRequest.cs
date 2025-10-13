namespace Eatzie.DTOs.Request
{
    public class FeedbackRequest
    {
        public string Content { get; set; }
        public int Rating { get; set; }
        public IFormFile? Image { get; set; }

    }
}