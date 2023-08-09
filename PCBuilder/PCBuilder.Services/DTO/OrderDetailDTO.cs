using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.Services.DTO
{
    public class OrderDetailDTO
    {
        public int Id { get; set; }

        public DateTime? OrderDate { get; set; }

        public int PcId { get; set; }

        public int UserId { get; set; }

        public decimal? Amount { get; set; }

        public string? StatusId { get; set; }

        public int PaymentId { get; set; }

        public PaymentDTO? PaymentDTO { get; set; }
        public UserDTO? userDTO { get; set; }
        public PcDTO? pcDTO { get; set; }
    }
}
