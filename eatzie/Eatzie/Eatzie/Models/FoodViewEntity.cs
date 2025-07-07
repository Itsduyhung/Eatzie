namespace Eatzie.Models
{
    public class FoodViewEntity
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public int Food_id { get; set; }
        public DateTime ViewedAt { get; set; }
        public string? DeviceInfo { get; set; }

        // Navigation
        public UserEntity User { get; set; }
        public FoodEntity Food { get; set; }
    }

}
