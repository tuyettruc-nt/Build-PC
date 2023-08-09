using Microsoft.EntityFrameworkCore;
using PCBuilder.Repository.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.Repository.Repository
{
    public interface IPaymentRepository
    {
        Task<Payment> GetPaymentByIdAsync(int id);
        Task<List<Payment>> GetAllPaymentsAsync();
        Task<Payment> CreatePaymentAsync(Payment payment);
        Task<Payment> UpdatePaymentAsync(Payment payment);
        Task<bool> DeletePaymentAsync(int id);
    }
    public class PaymentRepository : IPaymentRepository
    {
        private readonly PcBuildingContext _dbContext;

        public PaymentRepository(PcBuildingContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Payment> GetPaymentByIdAsync(int id)
        {
            return await _dbContext.Payments.FindAsync(id);
        }

        public async Task<List<Payment>> GetAllPaymentsAsync()
        {
            return await _dbContext.Payments.ToListAsync();
        }

        public async Task<Payment> CreatePaymentAsync(Payment payment)
        {
            _dbContext.Payments.Add(payment);
            await _dbContext.SaveChangesAsync();
            return payment;
        }

        public async Task<Payment> UpdatePaymentAsync(Payment payment)
        {
            _dbContext.Entry(payment).State = EntityState.Modified;
            await _dbContext.SaveChangesAsync();
            return payment;
        }

        public async Task<bool> DeletePaymentAsync(int id)
        {
            var payment = await _dbContext.Payments.FindAsync(id);
            if (payment == null)
                return false;

            _dbContext.Payments.Remove(payment);
            await _dbContext.SaveChangesAsync();
            return true;
        }
    }
}
