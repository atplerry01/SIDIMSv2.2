using SID.Common.Model.Infrastructure;
using SID.Common.Model.Inventory;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace SID.Common.Model.Production
{
    public class Sid09CustomerService
    {
        public int Id { get; set; }
        public int DeliveryNoteLogId { get; set; }
        public string CreatedById { get; set; }
        public DateTime CreatedOn { get; set; }


        [ForeignKey("CreatedById")]
        public virtual ApplicationUser CreatedBy { get; set; }

        [ForeignKey("DeliveryNoteLogId")]
        public virtual DeliveryNoteLog DeliveryNoteLog { get; set; }
        
    }
}