using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.Services.DTO
{
    public class PaymentDTO
    {
        public int Id { get; set; }

        public string? Name { get; set; }

        public decimal? Amount { get; set; }

        public long Code { get; set; }

        public string? PaymentMode { get; set; }

        public string? PaymentTime { get; set; }
    }
}
