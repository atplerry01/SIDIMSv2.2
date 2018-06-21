using SID.Common.Model.Infrastructure;
using SID.Common.Model.Lookups;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace SID.Common.Model.Inventory
{
    public class DeliveryNote
    {
        public DeliveryNote()
        {
            HasTemplate = false;
            AuditStatus = false;
            CustomerServiceStatus = false;
        }

        public int Id { get; set; }
        public int SidClientId { get; set; }
        public int DeliveryProfileId { get; set; }
        public bool HasTemplate { get; set; }
        public string Description { get; set; }
        public string CreatedById { get; set; }
        public DateTime TransactionDate { get; set; }
        public bool AuditStatus { get; set; }
        public bool CustomerServiceStatus { get; set; }
        // If (No Template) use DeliveryNoteTemplate(General)

        [ForeignKey("SidClientId")]
        public virtual SidClient SidClient { get; set; }

        [ForeignKey("DeliveryProfileId")]
        public virtual DeliveryProfile DeliveryProfile { get; set; }
        
        [ForeignKey("CreatedById")]
        public virtual ApplicationUser CreatedBy { get; set; }

        //public virtual ICollection<DeliveryNoteLog> DeliveryNoteLogList { get; set; }

    }
}