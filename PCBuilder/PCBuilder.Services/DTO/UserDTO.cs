using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.Services.DTO
{
    public class UserDTO
    {
        public int Id { get; set; }
        public string? Fullname { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Country { get; set; }
        public string? Gender { get; set; }
        public string? Password { get; set; }
        public string? Address { get; set; }
        public string? Avatar { get; set; }
        public bool? IsActive { get; set; }
        public int RoleId { get; set; }

    }
}
