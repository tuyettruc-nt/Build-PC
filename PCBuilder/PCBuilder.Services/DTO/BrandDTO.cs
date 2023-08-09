using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.Services.DTO
{
    public class BrandDTO
    {
        public int Id { get; set; }

        public string? Name { get; set; }

        public string? Logo { get; set; }

        public string? Origin { get; set; }

        public bool Status { get; set; }

    }
}
