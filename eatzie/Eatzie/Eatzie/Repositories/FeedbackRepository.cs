using Eatzie.Data;
using Eatzie.Interfaces.IRepository;
using Eatzie.Models;

namespace Eatzie.Repositories
{
    public class FeedbackRepository : IFeedbackRepository
    {
        private readonly ApplicationDbContext _context;

        public FeedbackRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(FeedbackEntity feedback)
        {
            _context.FeedbackEntitys.Add(feedback);
            await _context.SaveChangesAsync();
        }
    }
}