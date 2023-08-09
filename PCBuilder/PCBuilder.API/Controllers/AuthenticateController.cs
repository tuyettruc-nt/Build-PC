using Microsoft.AspNetCore.Mvc;
using PCBuilder.Repository.Model;
using PCBuilder.Services.DTO;
using PCBuilder.Services.Service;

namespace PCBuilder.API.Controllers
{
    public class LoginRequest
    {
        public string? Email { get; set; }
        public string? Password { get; set; }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticateController : ControllerBase
    {
        private readonly IUserServices _userServices;
        private readonly IGoogleServices _googleServices;

        public AuthenticateController(IUserServices userServices, IGoogleServices googleServices)
        {
            _userServices = userServices;
            _googleServices = googleServices;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
        {
            var response = await _userServices.Login(loginRequest.Email, loginRequest.Password);
            if (!response.Success)
            {
                return Unauthorized(new { success = response.Success, message = response.Message });
            }
            return Ok(
                new
                {
                    success = response.Success,
                    message = response.Message,
                    token = response.Data
                }
            );
        }

        [HttpPost("signup")]
        public async Task<IActionResult> SignUp([FromBody] UserDTO userDTO)
        {
            var response = await _userServices.Signup(userDTO);
            if (!response.Success)
            {
                return BadRequest(new { message = response.Message, error = response.ErrorMessages });
            }
            return Ok(new { message = response.Data });
        }

        [HttpPost("google-login")]
        public async Task<IActionResult> LoginWithGoogle([FromBody] GoogleLoginRequestDTO request)
        {
            var response = await _googleServices.LoginWithGoogle(request.IdToken);

            if (!response.Success)
            {
                return BadRequest(new { message = response.Message, errorMessage = response.ErrorMessages });
            }

            return Ok(
                new
                {
                    success = response.Success,
                    message = response.Message,
                    token = response.Data
                });
        }
    }
}
