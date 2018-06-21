using SID.Common.Model.Infrastructure;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace SID.Common.Model.Inventory
{
    public class DeliveryNoteMaterialAudit
    {
        public int Id { get; set; }
        public int DeliveryNoteId { get; set; }
        public string AssignedDriverId { get; set; }
        public string CreatedById { get; set; }
        public DateTime CreatedOn { get; set; }

        [ForeignKey("AssignedDriverId")]
        public virtual ApplicationUser AssignedDriver { get; set; }

        [ForeignKey("CreatedById")]
        public virtual ApplicationUser CreatedBy { get; set; }

    }
}