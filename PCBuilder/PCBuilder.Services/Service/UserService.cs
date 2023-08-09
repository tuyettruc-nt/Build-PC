using PCBuilder.Repository.Repository;
using PCBuilder.Repository.Model;
using PCBuilder.Services.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PCBuilder.Services.DTO;
using AutoMapper;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration;
using System.Security.Cryptography;
using System.Data.Common;

namespace PCBuilder.Services.Service
{
    public interface IUserServices
    {
        Task<ServiceResponse<List<UserDTO>>> GetUsersAsync();
        Task<ServiceResponse<UserDTO>> GetUserByIdAsync(int id);
        Task<ServiceResponse<UserDTO>> CreateUserAsync(UserDTO userDTO);
        Task<ServiceResponse<UserDTO>> UpdateUserAsync(int id, UserDTO userDTO);
        Task<ServiceResponse<bool>> DeleteUserAsync(int id);

        Task<ServiceResponse<AuthResponseDTO>> Login(string email, string password);
        Task<ServiceResponse<UserDTO>> Signup(UserDTO userDTO);
    }

    public class UserService : IUserServices
    {
        private readonly IUserRepository _iUserRepository;
        private readonly IRoleRepository _iRoleRepository;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;

        public UserService(
            IUserRepository iUserRepository,
            IRoleRepository iRoleRepository,
            IMapper mapper,
            IConfiguration configuration
        )
        {
            _iUserRepository = iUserRepository;
            _mapper = mapper;
            _iRoleRepository = iRoleRepository;
            _configuration = configuration;
        }

        public async Task<ServiceResponse<List<UserDTO>>> GetUsersAsync()
        {
            ServiceResponse<List<UserDTO>> _response = new();

            try
            {
                var UsersList = await _iUserRepository.GetAllUsersAsync();

                var UserListDto = new List<UserDTO>();

                foreach (var item in UsersList)
                {
                    UserListDto.Add(_mapper.Map<UserDTO>(item));
                }

                //OR
                //UserListDto.AddRange(from item in CompaniesList select _mapper.Map<UserDTO>(item));
                _response.Success = true;
                _response.Message = "User retrieved successfully";
                _response.Data = UserListDto;
            }
            catch (Exception ex)
            {
                _response.Success = false;
                _response.Data = null;
                _response.Message = "Error";
                _response.ErrorMessages = new List<string> { Convert.ToString(ex.Message) };
            }

            return _response;
        }

        public async Task<ServiceResponse<UserDTO>> GetUserByIdAsync(int id)
        {
            ServiceResponse<UserDTO> response = new ServiceResponse<UserDTO>();

            try
            {
                var user = await _iUserRepository.GetUserByIdAsync(id);

                if (user == null)
                {
                    response.Success = false;
                    response.Message = "User not found.";
                    return response;
                }

                var userDto = _mapper.Map<UserDTO>(user);

                response.Data = userDto;
                response.Success = true;
                response.Message = "User retrieved successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = "Error";
                response.ErrorMessages = new List<string> { ex.Message };
            }

            return response;
        }

        public async Task<ServiceResponse<UserDTO>> CreateUserAsync(UserDTO userDTO)
        {
            var response = new ServiceResponse<UserDTO>();

            try
            {
                var user = _mapper.Map<User>(userDTO);
                var createdUser = await _iUserRepository.CreateUserAsync(user);
                var createdUserDto = _mapper.Map<UserDTO>(createdUser);

                response.Data = createdUserDto;
                response.Success = true;
                response.Message = "User created successfully.";
            }
            catch (DbException ex)
            {
                response.Success = false;
                response.Message = "Database error occurred.";
                response.ErrorMessages = new List<string> { ex.Message };
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = "Error";
                response.ErrorMessages = new List<string> { ex.Message };
            }

            return response;
        }

        public async Task<ServiceResponse<UserDTO>> UpdateUserAsync(int id, UserDTO userDTO)
        {
            ServiceResponse<UserDTO> response = new ServiceResponse<UserDTO>();

            try
            {
                var existingUser = await _iUserRepository.GetUserByIdAsync(id);

                if (existingUser == null)
                {
                    response.Success = false;
                    response.Message = "User not found.";
                    return response;
                }

                // Update the properties of the existing user
                var updated = _mapper.Map(userDTO, existingUser);

                var updatedUser = await _iUserRepository.UpdateUserAsync(updated);
                var updatedUserDto = _mapper.Map<UserDTO>(updatedUser);

                response.Data = updatedUserDto;
                response.Success = true;
                response.Message = "User updated successfully.";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = "Error";
                response.ErrorMessages = new List<string> { ex.Message };
            }

            return response;
        }

        public async Task<ServiceResponse<bool>> DeleteUserAsync(int id)
        {
            ServiceResponse<bool> response = new ServiceResponse<bool>();

            try
            {
                var isDeleted = await _iUserRepository.DeleteUserAsync(id);

                if (!isDeleted)
                {
                    response.Success = false;
                    response.Message = "User not found.";
                    response.Data = false;
                    return response;
                }

                response.Data = true;
                response.Success = true;
                response.Message = "User deleted successfully.";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = "Error";
                response.ErrorMessages = new List<string> { ex.Message };
            }

            return response;
        }


        public async Task<ServiceResponse<AuthResponseDTO>> Login(string email, string password)
        {
            ServiceResponse<AuthResponseDTO> response = new ServiceResponse<AuthResponseDTO>();
            var user = await _iUserRepository.GetUserByEmailAsync(email);
            if (user == null || user.Password != password)
            {
                response.Success = false;
                response.Message = "Invalid username or password";
                return response;
            }

            var role = await _iRoleRepository.GetRoleByIdAsync(user.RoleId);
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, role.Name),
                new Claim("id", user.Id.ToString()),
                new Claim("fullName", user.Fullname),
                new Claim("phone", user.Phone),
                new Claim("country", user.Country.ToString()),
                new Claim("gender", user.Gender.ToString()),
                new Claim("address", user.Address),
                new Claim("avatar", user.Avatar)
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
                UserDTO = new UserDTO
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
                    IsActive = true,
                    RoleId = user.RoleId
                }
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

        public async Task<ServiceResponse<UserDTO>> Signup(UserDTO userDTO)
        {
            ServiceResponse<UserDTO> response = new ServiceResponse<UserDTO>();

            try
            {
                // Kiểm tra xem email đã tồn tại trong hệ thống hay chưa
                var existingUser = await _iUserRepository.GetUserByEmailAsync(userDTO.Email);
                if (existingUser != null)
                {
                    response.Success = false;
                    response.Message = "Email is already taken.";
                    return response;
                }

                // Tạo một đối tượng User mới từ dữ liệu được gửi lên
                var newUser = _mapper.Map<User>(userDTO);

                // Thực hiện logic lưu trữ hoặc xác thực tài khoản người dùng
                var createdUser = await _iUserRepository.CreateUserAsync(newUser);
                var createdUserDto = _mapper.Map<UserDTO>(createdUser);

                response.Data = createdUserDto;
                response.Success = true;
                response.Message = "User sign up successfully.";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = "User sign up failed.";
                response.ErrorMessages = new List<string> { ex.Message };
            }
            return response;
        }
    }
}
