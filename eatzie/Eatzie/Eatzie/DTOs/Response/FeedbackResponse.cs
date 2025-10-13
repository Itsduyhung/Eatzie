namespace Eatzie.DTOs.Response
{
    public class FeedbackResponse
    {
        public int Id { get; set; }
        public int Food_id { get; set; }
        public int? UserId { get; set; }
        public string Content { get; set; }
        public double Rating { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsResolved { get; set; }
        public string? Image { get; set; }
    }

}