using System;
using System.Collections.Generic;

namespace PCBuilder.Repository.Model;

public partial class Order
{
    public int Id { get; set; }

    public DateTime OrderDate { get; set; }

    public int PcId { get; set; }

    public int UserId { get; set; }

    public decimal? Amount { get; set; }

    public string? StatusId { get; set; }

    public int PaymentId { get; set; }

    public virtual Payment? Payment { get; set; }

    public virtual Pc Pc { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
