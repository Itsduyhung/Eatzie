namespace Eatzie.DTOs.Request
{
    public class FeedbackRequest
    {
        public int UserId { get; set; }
        public int Food_id { get; set; }
        public string Content { get; set; }
        public int Rating { get; set; }
    }
}