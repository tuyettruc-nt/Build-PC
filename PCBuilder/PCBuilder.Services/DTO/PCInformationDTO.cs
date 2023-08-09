using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.Services.DTO
{
    public class PCInformationDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Summary { get; set; }
        public string? Detail { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public decimal Discount { get; set; }
        public int TemplateId { get; set; }
        public bool IsPublic { get; set; }
        public int DesignBy { get; set; }
        public string Image { get; set; }
        public bool IsTemplate { get; set; }
        public List<ComponentDTO> Components { get; set; }
    }
}
