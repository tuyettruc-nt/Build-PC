using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PCBuilder.Repository.Model;
using PCBuilder.Services.DTO;
using PCBuilder.Services.Service;
using System.Data;

namespace PCBuilder.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderServices _orderServices;

        public OrderController(IOrderServices orderServices)
        {
            _orderServices = orderServices;
        }

        [HttpGet("{orderId}")]
        public async Task<IActionResult> GetOrderById(int orderId)
        {
            var response = await _orderServices.GetOrderById(orderId);

            if (!response.Success)
            {
                return NotFound(response);
            }

            return Ok(response);
        }
        [HttpGet("byUserId/{userId}")]
        public async Task<IActionResult> GetOrderByUserId(int userId)
        {
            var response = await _orderServices.GetOrderByUserId(userId);

            if (!response.Success)
            {
                return NotFound(response);
            }

            return Ok(response);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllOrders()
        {
            var response = await _orderServices.GetAllOrders();
            return Ok(response);
        }

        [HttpPost("CreateOrderWithPayment")]
        public async Task<IActionResult> CreateOrderWithPayment([FromBody] OrderPaymentDTO orderDTO)
        {
            var response = await _orderServices.CreateOrderWithPayment(orderDTO);

            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] OrderDTO orderDTO)
        {


            var response = await _orderServices.CreateOrder(orderDTO);

            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }

        //[Authorize(Roles = "Admin, Employee")]
        [HttpPut("{orderId}")]
        public async Task<IActionResult> UpdateOrder(int orderId, [FromBody] OrderDTO orderDTO)
        {

            var response = await _orderServices.UpdateOrder(orderId, orderDTO);

            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }

        //[Authorize(Roles = "Admin, Employee")]
        [HttpDelete("{orderId}")]
        public async Task<IActionResult> DeleteOrder(int orderId)
        {
            var response = await _orderServices.DeleteOrder(orderId);

            if (!response.Success)
            {
                return NotFound(response);
            }

            return Ok(response);
        }
    }
}
