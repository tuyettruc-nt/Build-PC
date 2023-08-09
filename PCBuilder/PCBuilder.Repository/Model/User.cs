using System;
using System.Collections.Generic;

namespace PCBuilder.Repository.Model;

public partial class User
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

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    public virtual ICollection<Pc> Pcs { get; set; } = new List<Pc>();

    public virtual Role Role { get; set; } = null!;
}
