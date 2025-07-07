namespace Eatzie.Models
{
    public class UserDietFoodEntity
    {
        public int UserDiet_id { get; set; }
        public UserDietEntity UserDiet { get; set; }

        public int Food_id { get; set; }
        public FoodEntity? Food { get; set; }
    }
}