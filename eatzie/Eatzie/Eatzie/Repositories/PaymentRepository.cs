using Eatzie.Data;
using Eatzie.Interfaces.IRepository;
using Eatzie.Models;
using Microsoft.EntityFrameworkCore;

namespace Eatzie.Repositories
{
    public class PaymentRepository(ApplicationDbContext dbContext) : IPaymentRepository
    {
        private readonly ApplicationDbContext _dbContext = dbContext;

        public async Task<PaymentEntity?> GetPaymentByIdAsync(int paymentId)
        {
            return await _dbContext.Payments
                .Include(p => p.Order)
                .FirstOrDefaultAsync(p => p.Id == paymentId);
        }

        public async Task<PaymentEntity?> GetPaymentByOrderIdAsync(int orderId)
        {
            return await _dbContext.Payments
                .Include(p => p.Order)
                .FirstOrDefaultAsync(p => p.OrderId == orderId);
        }

        public async Task<PaymentEntity?> GetPaymentByCodeAsync(string code)
        {
            return await _dbContext.Payments
                .Include(p => p.Order)
                .FirstOrDefaultAsync(p => p.PayOSCode == code);
        }

        public async Task<PaymentEntity> AddPaymentAsync(PaymentEntity payment)
        {
            await _dbContext.Payments.AddAsync(payment);
            return payment;
        }

        public Task UpdatePaymentAsync(PaymentEntity payment)
        {
            _dbContext.Payments.Update(payment);
            return Task.CompletedTask;
        }
    }
}

