using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PCBuilder.Services.DTO;
using PCBuilder.Services.Service;

namespace PCBuilder.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentServices _paymentServices;

        public PaymentController(IPaymentServices paymentServices)
        {
            _paymentServices = paymentServices;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPaymentById(int id)
        {
            var response = await _paymentServices.GetPaymentByIdAsync(id);

            if (!response.Success)
            {
                return NotFound(response);
            }

            return Ok(response);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllPayments()
        {
            var response = await _paymentServices.GetAllPaymentsAsync();
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CreatePayment([FromBody] PaymentDTO paymentDTO)
        {
            var response = await _paymentServices.CreatePaymentAsync(paymentDTO);

            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePayment(int id, [FromBody] PaymentDTO paymentDTO)
        {
            var response = await _paymentServices.UpdatePaymentAsync(id, paymentDTO);

            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePayment(int id)
        {
            var response = await _paymentServices.DeletePaymentAsync(id);

            if (!response.Success)
            {
                return NotFound(response);
            }

            return Ok(response);
        }
    }

}
