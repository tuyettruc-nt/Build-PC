using System;
using System.Collections.Generic;

namespace PCBuilder.Repository.Model;

public partial class Brand
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Logo { get; set; }

    public string? Origin { get; set; }

    public bool? Status { get; set; }

    public virtual ICollection<Category> Categories { get; set; } = new List<Category>();

    public virtual ICollection<Component> Components { get; set; } = new List<Component>();
}
