using System;
using System.Collections.Generic;

namespace PCBuilder.Repository.Model;

public partial class Pc
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Summary { get; set; } = null!;

    public string? Detail { get; set; }

    public string? Description { get; set; }

    public decimal? Price { get; set; }

    public decimal? Discount { get; set; }

    public int? TemplateId { get; set; }

    public bool? IsPublic { get; set; }

    public int? DesignBy { get; set; }

    public string? Image { get; set; }

    public bool? IsTemplate { get; set; }

    public virtual User? DesignByNavigation { get; set; }

    public virtual ICollection<Pc> InverseTemplate { get; set; } = new List<Pc>();

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    public virtual ICollection<PcComponent> PcComponents { get; set; } = new List<PcComponent>();

    public virtual Pc? Template { get; set; }
}
