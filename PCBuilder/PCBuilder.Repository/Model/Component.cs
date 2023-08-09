using System;
using System.Collections.Generic;

namespace PCBuilder.Repository.Model;

public partial class Component
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Image { get; set; }

    public decimal? Price { get; set; }

    public string Summary { get; set; } = null!;

    public string? Description { get; set; }

    public int BrandId { get; set; }

    public int CategoryId { get; set; }

    public bool? IsPublic { get; set; }

    public virtual Brand Brand { get; set; } = null!;

    public virtual Category Category { get; set; } = null!;

    public virtual ICollection<PcComponent> PcComponents { get; set; } = new List<PcComponent>();
}
