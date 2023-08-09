using AutoMapper;
using PCBuilder.Repository.Model;
using PCBuilder.Repository.Repository;
using PCBuilder.Services.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.Services.Service
{
    public interface IOrderServices
    {
        Task<ServiceResponse<OrderDTO>> GetOrderById(int orderId);
        Task<ServiceResponse<List<OrderDetailDTO>>> GetOrderByUserId(int userId);
        Task<ServiceResponse<List<OrderDTO>>> GetAllOrders();
        Task<ServiceResponse<OrderDTO>> CreateOrder(OrderDTO orderDTO);
        Task<ServiceResponse<OrderDTO>> UpdateOrder(int id, OrderDTO orderDTO);
        Task<ServiceResponse<bool>> DeleteOrder(int orderId);

        Task<ServiceResponse<OrderPaymentDTO>> CreateOrderWithPayment(OrderPaymentDTO orderPaymentDTO);
    }
    public class OrderService : IOrderServices
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IMapper _mapper;
        private readonly IPaymentRepository _paymentRepository;
        private readonly IPCRepository _pcRepository;
        private readonly IUserRepository _userRepository;

        public OrderService(IOrderRepository orderRepository, IMapper mapper, IPaymentRepository paymentRepository, IPCRepository pcRepository, IUserRepository userRepository)
        {
            this._orderRepository = orderRepository;
            this._mapper = mapper;
            this._paymentRepository = paymentRepository;
            this._pcRepository = pcRepository;
            this._userRepository = userRepository;
        }

        public async Task<ServiceResponse<OrderDTO>> GetOrderById(int orderId)
        {
            ServiceResponse<OrderDTO> response = new ServiceResponse<OrderDTO>();

            try
            {
                var order = await _orderRepository.GetOrderByIdAsync(orderId);

                if (order == null)
                {
                    response.Success = false;
                    response.Message = "Order not found.";
                    return response;
                }

                var OrderDTO = _mapper.Map<OrderDTO>(order);

                response.Data = OrderDTO;
                response.Success = true;
                response.Message = "Order retrieved successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = "Error";
                response.ErrorMessages = new List<string> { ex.Message };
            }

            return response;
        }

        public async Task<ServiceResponse<List<OrderDTO>>> GetAllOrders()
        {
            var response = new ServiceResponse<List<OrderDTO>>();

            try
            {
                var orders = await _orderRepository.GetAllOrdersAsync();
                var orderDTOs = _mapper.Map<List<OrderDTO>>(orders);

                response.Data = orderDTOs;
                response.Success = true;
                response.Message = "Order retrieved successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = "Error";
                response.ErrorMessages = new List<string> { ex.Message };
            }

            return response;
        }

        public async Task<ServiceResponse<OrderDTO>> CreateOrder(OrderDTO orderDTO)
        {
            ServiceResponse<OrderDTO> response = new ServiceResponse<OrderDTO>();

            try
            {
                var order = _mapper.Map<Order>(orderDTO);
                var createdOrder = await _orderRepository.CreateOrderAsync(order);
                var createdOrderDTO = _mapper.Map<OrderDTO>(createdOrder);

                response.Data = createdOrderDTO;
                response.Success = true;
                response.Message = "Order create successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = "Error";
                response.ErrorMessages = new List<string> { ex.Message };
            }

            return response;
        }


        public async Task<ServiceResponse<OrderDTO>> UpdateOrder(int id, OrderDTO orderDTO)
        {
            ServiceResponse<OrderDTO> response = new ServiceResponse<OrderDTO>();

            try
            {
                var existingOrder = await _orderRepository.GetOrderByIdAsync(id);

                if (existingOrder == null)
                {
                    response.Success = false;
                    response.Message = "Order not found.";
                    return response;
                }
                var updatedOrder = _mapper.Map(orderDTO, existingOrder);
                var savedOrder = await _orderRepository.UpdateOrderAsync(updatedOrder);
                var savedOrderDTO = _mapper.Map<OrderDTO>(savedOrder);

                response.Data = savedOrderDTO;
                response.Success = true;
                response.Message = "Order update successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = "Error";
                response.ErrorMessages = new List<string> { ex.Message };
            }

            return response;
        }

        public async Task<ServiceResponse<bool>> DeleteOrder(int orderId)
        {
            ServiceResponse<bool> response = new ServiceResponse<bool>();

            try
            {
                var existingOrder = await _orderRepository.GetOrderByIdAsync(orderId);

                if (existingOrder == null)
                {
                    response.Success = false;
                    response.Message = "Order not found.";
                    return response;
                }

                var success = await _orderRepository.DeleteOrderAsync(orderId);

                response.Data = success;
                response.Success = true;
                response.Message = "Order delete successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = "Error";
                response.ErrorMessages = new List<string> { ex.Message };
            }

            return response;
        }

        public async Task<ServiceResponse<OrderPaymentDTO>> CreateOrderWithPayment(OrderPaymentDTO orderPaymentDTO)
        {
            ServiceResponse<OrderPaymentDTO> response = new ServiceResponse<OrderPaymentDTO>();


            try
            {
                var payment = _mapper.Map<Payment>(orderPaymentDTO.PaymentDTO);
                var paymentDTO = await _paymentRepository.CreatePaymentAsync(payment);
                var createPayment = _mapper.Map<PaymentDTO>(paymentDTO);

                orderPaymentDTO.PaymentDTO = createPayment;
                orderPaymentDTO.PaymentId = createPayment.Id;

                var orderPayment = _mapper.Map<Order>(orderPaymentDTO);
                var orderDTO = await _orderRepository.CreateOrderAsync(orderPayment);
                var createOrder = _mapper.Map<OrderPaymentDTO>(orderDTO);
                createOrder.PaymentDTO = createPayment;


                response.Data = createOrder;
                response.Success = true;
                response.Message = "Order create successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = "Error";
                response.ErrorMessages = new List<string> { ex.Message };
            }
            return response;
        }

        public async Task<ServiceResponse<List<OrderDetailDTO>>> GetOrderByUserId(int userId)
        {
            var response = new ServiceResponse<List<OrderDetailDTO>>();

            try
            {
                // Fetch user data once since it's the same for all orders
                var user = await _userRepository.GetUserByIdAsync(userId);

                if (user == null)
                {
                    response.Success = false;
                    response.Message = "User not found.";
                    return response;
                }

                var orders = await _orderRepository.GetOrderByUserIdAsync(userId);

                if (orders == null)
                {
                    response.Success = false;
                    response.Message = "No orders found for the given user.";
                    return response;
                }

                var orderDTOs = new List<OrderDetailDTO>();
                foreach (var order in orders)
                {
                    int paymentId = order.PaymentId;
                    int pcId = order.PcId;

                    var payment = await _paymentRepository.GetPaymentByIdAsync(paymentId);
                    var pc = await _pcRepository.GetPcsByIdAsync(pcId);

                    var OrderDTO = new OrderDetailDTO
                    {
                        Id = order.Id,
                        OrderDate = order.OrderDate,
                        Amount = order.Amount,
                        StatusId = order.StatusId,
                    };

                    if (payment != null && pc != null)
                    {
                        var paymentDTO = new PaymentDTO
                        {
                            Id = payment.Id,
                            Name = payment.Name,
                            Amount = payment.Amount,
                            Code = payment.Code,
                            PaymentMode = payment.PaymentMode,
                            PaymentTime = payment.PaymentTime
                        };
                        var pcDTO = new PcDTO
                        {
                            Id = pc.Id,
                            Name = pc.Name,
                            Summary = pc.Summary,
                            Detail = pc.Detail,
                            Price = pc.Price,
                            Discount = pc.Discount,
                            Image = pc.Image
                        };

                        OrderDTO.PaymentDTO = paymentDTO;
                        OrderDTO.pcDTO = pcDTO;
                    }

                    // Use the user data fetched earlier
                    OrderDTO.userDTO = new UserDTO()
                    {
                        Id = user.Id,
                        Fullname = user.Fullname,
                        Email = user.Email,
                        Phone = user.Phone,
                        Country = user.Country,
                        Gender = user.Gender,
                        Address = user.Address,
                        Avatar = user.Avatar
                    };

                    orderDTOs.Add(OrderDTO);
                }

                response.Data = orderDTOs;
                response.Success = true;
                response.Message = "Orders retrieved successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = "Error";
                response.ErrorMessages = new List<string> { ex.Message };
            }

            return response;
        }
    }
}
