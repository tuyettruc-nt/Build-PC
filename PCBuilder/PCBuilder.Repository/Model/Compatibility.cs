using System;
using System.Collections.Generic;

namespace PCBuilder.Repository.Model;

public partial class Compatibility
{
    public int Id { get; set; }

    public int? Category01Id { get; set; }

    public int? Category02Id { get; set; }

    public virtual Category? Category01 { get; set; }

    public virtual Category? Category02 { get; set; }
}
