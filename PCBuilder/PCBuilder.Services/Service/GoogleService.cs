using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using AutoMapper;
using Google.Apis.Auth;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using PCBuilder.Repository.Model;
using PCBuilder.Repository.Repository;
using PCBuilder.Services.DTO;

namespace PCBuilder.Services.Service
{
    public interface IGoogleServices
    {
        Task<ServiceResponse<AuthResponseDTO>> LoginWithGoogle(string idToken);
        Task<ServiceResponse<AuthResponseDTO>> ReturnTokenWhenLoginGoogle(string email);
    }
    public class GoogleService : IGoogleServices
    {
        private readonly IUserRepository _iUserRepository;
        private readonly IRoleRepository _iRoleRepository;
        private readonly IUserServices _iUserService;
        private readonly IConfiguration _configuration;
        public GoogleService
        (
            IUserRepository iUserRepository,
            IRoleRepository iRoleRepository,
            IUserServices iUserServices,
            IConfiguration configuration
        )
        {
            _iUserRepository = iUserRepository;
            _iRoleRepository = iRoleRepository;
            _iUserService = iUserServices;
            _configuration = configuration;
        }

        public async Task<ServiceResponse<AuthResponseDTO>> LoginWithGoogle(string idToken)
        {
            var response = new ServiceResponse<AuthResponseDTO>();

            try
            {
                // Xác thực token với Google
                GoogleJsonWebSignature.ValidationSettings settings = new GoogleJsonWebSignature.ValidationSettings();
                GoogleJsonWebSignature.Payload payload = await GoogleJsonWebSignature.ValidateAsync(idToken, settings);

                // Kiểm tra xem người dùng có tồn tại trong hệ thống hay không
                var user = await _iUserRepository.GetUserByEmailAsync(payload.Email);
                if (user == null)
                {
                    // Tạo người dùng mới trong hệ thống
                    user = new User
                    {
                        Email = payload.Email,
                        Fullname = payload.Name,
                        Password = "1",
                        Avatar = payload.Picture,
                        RoleId = 1,
                        IsActive = true
                        // Gán các thông tin khác từ payload nếu cần
                    };
                    await _iUserRepository.CreateUserAsync(user);
                }

                // Tạo mã thông báo JWT
                var loginResponse = await ReturnTokenWhenLoginGoogle(user.Email);

                if (!loginResponse.Success)
                {
                    // Xử lý lỗi khi đăng nhập
                    response.Success = false;
                    response.Message = "Login with Google failed..";
                    response.ErrorMessages = loginResponse.ErrorMessages;
                    return response;
                }

                response.Data = loginResponse.Data;
                response.Success = true;
                response.Message = "Login with Google successful.";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = "Login with Google failed.";
                response.ErrorMessages = new List<string> { ex.Message };
            }

            return response;
        }

        public async Task<ServiceResponse<AuthResponseDTO>> ReturnTokenWhenLoginGoogle(string email)
        {
            ServiceResponse<AuthResponseDTO> response = new ServiceResponse<AuthResponseDTO>();
            var user = await _iUserRepository.GetUserByEmailAsync(email);
            if (user == null)
            {
                response.Success = false;
                response.Message = "Invalid email";
                return response;
            }

            var role = await _iRoleRepository.GetRoleByIdAsync(user.RoleId);
            await _iUserRepository.UpdateUserAsync(user); // neu tai khoan da bi xoa ma muon dang nhap lai thi set tai khoan hoat dong lai
            UserDTO userdto = new UserDTO
            {
                Id = user.Id,
                Fullname = user.Fullname,
                Email = user.Email,
                Phone = user.Phone,
                Country = user.Country,
                Gender = user.Gender,
                Password = user.Password,
                Address = user.Address,
                Avatar = user.Avatar,
                IsActive = user.IsActive,
                RoleId = 1
            };
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, role.Name)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["JwtSettings:SecretKey"]);
            var issuer = _configuration["JwtSettings:Issuer"];
            var audience = _configuration["JwtSettings:Audience"];

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(7),
                Issuer = issuer,
                Audience = audience,
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature
                )
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var jwt = tokenHandler.WriteToken(token);

            var refreshToken = GenerateRefreshToken();
            var refreshTokenExpiration = DateTime.UtcNow.AddDays(30); // Thời gian hết hạn của RefreshToken

            var authResponse = new AuthResponseDTO
            {
                Token = jwt,
                RefreshToken = refreshToken,
                ExpiresIn = tokenDescriptor.Expires ?? DateTime.UtcNow.AddDays(7),
                UserDTO = userdto
            };

            response.Success = true;
            response.Message = "Login successful.";
            response.Data = authResponse;

            return response;
        }

        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                return Convert.ToBase64String(randomNumber);
            }
        }

    }
}
