using System.ComponentModel.DataAnnotations;
using Eatzie.Models;

namespace Eatzie.Models
{
    public class HistoryFoodEntity
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int Food_id { get; set; }
        public DateTime SuggestedAt { get; set; }
        public bool IsSelected { get; set; }
        public UserEntity User { get; set; }
        public FoodEntity Food { get; set; }
    }
}