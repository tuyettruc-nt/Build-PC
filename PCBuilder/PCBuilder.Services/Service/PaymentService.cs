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
    public interface IPaymentServices
    {
        Task<ServiceResponse<PaymentDTO>> GetPaymentByIdAsync(int id);
        Task<ServiceResponse<List<PaymentDTO>>> GetAllPaymentsAsync();
        Task<ServiceResponse<PaymentDTO>> CreatePaymentAsync(PaymentDTO paymentDTO);
        Task<ServiceResponse<PaymentDTO>> UpdatePaymentAsync(int id, PaymentDTO paymentDTO);
        Task<ServiceResponse<bool>> DeletePaymentAsync(int id);

    }
    public class PaymentService : IPaymentServices
    {
        private readonly IPaymentRepository _paymentRepository;
        private readonly IMapper _mapper;
        public PaymentService(IPaymentRepository paymentRepository, IMapper mapper)
        {
            this._paymentRepository = paymentRepository;
            this._mapper = mapper;

        }

        public async Task<ServiceResponse<PaymentDTO>> GetPaymentByIdAsync(int id)
        {
            ServiceResponse<PaymentDTO> response = new ServiceResponse<PaymentDTO>();

            try
            {
                var payment = await _paymentRepository.GetPaymentByIdAsync(id);

                if (payment == null)
                {
                    response.Success = false;
                    response.Message = "Payment not found.";
                    return response;
                }

                var paymentDTO = _mapper.Map<PaymentDTO>(payment);

                response.Data = paymentDTO;
                response.Success = true;
                response.Message = "Payment retrieved successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = "Error";
                response.ErrorMessages = new List<string> { ex.Message };
            }

            return response;
        }

        public async Task<ServiceResponse<List<PaymentDTO>>> GetAllPaymentsAsync()
        {
            ServiceResponse<List<PaymentDTO>> response = new ServiceResponse<List<PaymentDTO>>();

            try
            {
                var payments = await _paymentRepository.GetAllPaymentsAsync();
                var paymentDTOs = _mapper.Map<List<PaymentDTO>>(payments);

                response.Data = paymentDTOs;
                response.Success = true;
                response.Message = "Payments retrieved successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = "Error";
                response.ErrorMessages = new List<string> { ex.Message };
            }

            return response;
        }

        public async Task<ServiceResponse<PaymentDTO>> CreatePaymentAsync(PaymentDTO paymentDTO)
        {
            ServiceResponse<PaymentDTO> response = new ServiceResponse<PaymentDTO>();

            try
            {
                var payment = _mapper.Map<Payment>(paymentDTO);
                var createdPayment = await _paymentRepository.CreatePaymentAsync(payment);
                var createdPaymentDTO = _mapper.Map<PaymentDTO>(createdPayment);

                response.Data = createdPaymentDTO;
                response.Success = true;
                response.Message = "Payment created successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = "Error";
                response.ErrorMessages = new List<string> { ex.Message };
            }

            return response;
        }

        public async Task<ServiceResponse<PaymentDTO>> UpdatePaymentAsync(int id, PaymentDTO paymentDTO)
        {
            ServiceResponse<PaymentDTO> response = new ServiceResponse<PaymentDTO>();

            try
            {
                var existingPayment = await _paymentRepository.GetPaymentByIdAsync(id);

                if (existingPayment == null)
                {
                    response.Success = false;
                    response.Message = "Payment not found.";
                    return response;
                }

                var updatedPayment = _mapper.Map(paymentDTO, existingPayment);
                var savedPayment = await _paymentRepository.UpdatePaymentAsync(updatedPayment);
                var savedPaymentDTO = _mapper.Map<PaymentDTO>(savedPayment);

                response.Data = savedPaymentDTO;
                response.Success = true;
                response.Message = "Payment updated successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = "Error";
                response.ErrorMessages = new List<string> { ex.Message };
            }

            return response;
        }

        public async Task<ServiceResponse<bool>> DeletePaymentAsync(int id)
        {
            ServiceResponse<bool> response = new ServiceResponse<bool>();

            try
            {
                var existingPayment = await _paymentRepository.GetPaymentByIdAsync(id);

                if (existingPayment == null)
                {
                    response.Success = false;
                    response.Message = "Payment not found.";
                    return response;
                }

                var success = await _paymentRepository.DeletePaymentAsync(id);

                response.Data = success;
                response.Success = true;
                response.Message = "Payment deleted successfully";
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
