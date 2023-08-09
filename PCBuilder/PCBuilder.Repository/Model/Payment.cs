using System;
using System.Collections.Generic;

namespace PCBuilder.Repository.Model;

public partial class Payment
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public decimal? Amount { get; set; }

    public long Code { get; set; }

    public string? PaymentMode { get; set; }

    public string? PaymentTime { get; set; }

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}
