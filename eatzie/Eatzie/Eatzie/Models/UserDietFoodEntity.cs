namespace Eatzie.Models
{
    public class UserDietFoodEntity
    {
        public int UserDietId { get; set; }
        public UserDietEntity UserDiet { get; set; }

        public int FoodId { get; set; }
        public FoodEntity? Food { get; set; }
    }
}