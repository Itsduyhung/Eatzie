namespace Eatzie.Models
{
    public class FeedbackEntity
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int Food_id { get; set; }
        public string Content { get; set; }
        public int Rating { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsResolved { get; set; }
        public string? ReplyMessage { get; set; }

        // Navigation
        public UserEntity User { get; set; }
        public FoodEntity Food { get; set; }
    }
}