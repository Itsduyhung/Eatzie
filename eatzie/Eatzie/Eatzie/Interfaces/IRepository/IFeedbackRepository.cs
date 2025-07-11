using Eatzie.Models;

namespace Eatzie.Interfaces.IRepository
{
    public interface IFeedbackRepository
    {
        Task AddAsync(FeedbackEntity feedback);
    }
}