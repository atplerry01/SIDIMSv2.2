using SID.Common.Model.Infrastructure;
using SID.Common.Model.Lookups;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace SID.Common.Model.Production
{
    public class PrintDelivery
    {
        public PrintDelivery()
        {
            IsDeliveryConfirmed = false;
            IsDeliveryCompleted = false;
            DeliveredOn = DateTime.Now;
        }

        public int Id { get; set; }
        public int JobTrackerId { get; set; }
        public int DepartmentId { get; set; }

        public int RangeFrom { get; set; }
        public int RangeTo { get; set; }
        public bool IsDeliveryConfirmed { get; set; }
        public bool IsDeliveryCompleted { get; set; }

        public string DeliveredById { get; set; }
        public DateTime DeliveredOn { get; set; }

        public string ConfirmedById { get; set; }
        public DateTime ConfirmedOn { get; set; }


        [ForeignKey("JobTrackerId")]
        public virtual JobTracker JobTracker { get; set; }

        [ForeignKey("DepartmentId")]
        public virtual Department Department { get; set; }

        [ForeignKey("DeliveredById")]
        public virtual ApplicationUser DeliveredBy { get; set; }

        [ForeignKey("ConfirmedById")]
        public virtual ApplicationUser ConfirmedBy { get; set; }

    }
}