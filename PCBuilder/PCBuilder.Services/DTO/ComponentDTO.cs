using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.Services.DTO
{
    public class ComponentDTO
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Image { get; set; }

        public decimal Price { get; set; }
        public string Summary { get; set; }

        public string Description { get; set; }

        public int BrandId { get; set; }

        public int CategoryId { get; set; }
    }
}
