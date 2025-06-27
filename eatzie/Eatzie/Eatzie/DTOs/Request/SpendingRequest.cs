namespace Eatzie.DTOs.Request
{
    public class SpendingRequest
    {
        public int UserId { get; set; }
        public decimal Min_spending { get; set; }
        public decimal Max_spending { get; set; }
    }
}