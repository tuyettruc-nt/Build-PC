using System;
namespace PCBuilder.Services.DTO
{
    public class AuthResponseDTO
    {
        public string? Token { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime ExpiresIn { get; set; }
        public UserDTO UserDTO { get; set; }
        public AuthResponseDTO()
        {
        }
    }
}
