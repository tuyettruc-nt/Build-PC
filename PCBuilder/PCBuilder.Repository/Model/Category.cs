using System;
using System.Collections.Generic;

namespace PCBuilder.Repository.Model;

public partial class Category
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public int? ParentId { get; set; }

    public int? BrandId { get; set; }

    public virtual Brand? Brand { get; set; }

    public virtual ICollection<Compatibility> CompatibilityCategory01s { get; set; } = new List<Compatibility>();

    public virtual ICollection<Compatibility> CompatibilityCategory02s { get; set; } = new List<Compatibility>();

    public virtual ICollection<Component> Components { get; set; } = new List<Component>();

    public virtual ICollection<Category> InverseParent { get; set; } = new List<Category>();

    public virtual Category? Parent { get; set; }
}
