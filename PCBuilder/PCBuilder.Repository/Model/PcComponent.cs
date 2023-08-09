using System;
using System.Collections.Generic;

namespace PCBuilder.Repository.Model;

public partial class PcComponent
{
    public int Id { get; set; }

    public int ComponentId { get; set; }

    public int PcId { get; set; }

    public int? Quantity { get; set; }

    public virtual Component Component { get; set; } = null!;

    public virtual Pc Pc { get; set; } = null!;
}
