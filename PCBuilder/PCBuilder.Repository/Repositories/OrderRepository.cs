using Microsoft.EntityFrameworkCore;
using PCBuilder.Repository.Model;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PCBuilder.Repository.Repository
{
    public interface IOrderRepository
    {
        Task<Order> GetOrderByIdAsync(int orderId);
        Task<List<Order>> GetAllOrdersAsync();
        Task<Order> CreateOrderAsync(Order order);
        Task<Order> UpdateOrderAsync(Order order);
        Task<bool> DeleteOrderAsync(int orderId);
        Task<List<Order>> GetOrderByUserIdAsync(int userId);

    }

    public class OrderRepository : IOrderRepository
    {
        private readonly PcBuildingContext _dbContext;

        public OrderRepository(PcBuildingContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Order> GetOrderByIdAsync(int orderId)
        {
            return await _dbContext.Orders.FindAsync(orderId);
        }
        public async Task<List<Order>> GetOrderByUserIdAsync(int userId)
        {
            var orders = await _dbContext.Orders
                                .Where(o => o.UserId == userId)
                                .ToListAsync();
            return orders;
        }

        public async Task<List<Order>> GetAllOrdersAsync()
        {
            return await _dbContext.Orders.ToListAsync();
        }

        public async Task<Order> CreateOrderAsync(Order order)
        {
            _dbContext.Orders.Add(order);
            await _dbContext.SaveChangesAsync();
            return order;
        }

        public async Task<Order> UpdateOrderAsync(Order order)
        {
            _dbContext.Orders.Update(order);
            await _dbContext.SaveChangesAsync();
            return order;
        }

        public async Task<bool> DeleteOrderAsync(int orderId)
        {
            var order = await _dbContext.Orders.FindAsync(orderId);
            if (order == null)
            {
                return false;
            }

            _dbContext.Orders.Remove(order);
            await _dbContext.SaveChangesAsync();
            return true;
        }
    }
}
