using Eatzie.Models;

namespace Eatzie.Interfaces.IRepository
{
    public interface IFoodViewRepository
    {
        Task AddAsync(FoodViewEntity view);
    }
}