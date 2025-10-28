using Eatzie.Models;

namespace Eatzie.Interfaces.IRepository
{
    public interface IPaymentRepository
    {
        Task<PaymentEntity?> GetPaymentByIdAsync(int paymentId);
        Task<PaymentEntity?> GetPaymentByOrderIdAsync(int orderId);
        Task<PaymentEntity?> GetPaymentByCodeAsync(string code);
        Task<PaymentEntity> AddPaymentAsync(PaymentEntity payment);
        Task UpdatePaymentAsync(PaymentEntity payment);
    }
}

