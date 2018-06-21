using SID.Common.Model.Infrastructure;
using SID.Common.Model.Production;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace SID.Common.Model.Inventory
{
    public class DeliveryNoteLog
    {
        public DeliveryNoteLog()
        {
            AuditStatus = false;
            CustomerServiceStatus = false;
            IsPartial = true;
        }

        public int Id { get; set; }
        public int DispatchDeliveryId { get; set; }
        public int DeliveryNoteId { get; set; }
        public int JobTrackerId { get; set; }
        
        public int QuantityReceived { get; set; }
        public int PreviousDelivery { get; set; }
        public int QuantityDelivered { get; set; }
        public int Ommitted { get; set; }
        public int Pending { get; set; }

        public bool IsPartial { get; set; }

        public bool AuditStatus { get; set; }
        public bool CustomerServiceStatus { get; set; }
        

        [ForeignKey("DispatchDeliveryId")]
        public virtual DispatchDelivery DispatchDelivery { get; set; }

        [ForeignKey("DeliveryNoteId")]
        public virtual DeliveryNote DeliveryNote { get; set; }

        [ForeignKey("JobTrackerId")]
        public virtual JobTracker JobTracker { get; set; }


    }
}