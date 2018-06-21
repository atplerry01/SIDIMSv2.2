using SID.Common.Model.Infrastructure;
using SID.Common.Model.Lookups;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace SID.Common.Model.Production
{
    public class CardDelivery
    {
        public CardDelivery()
        {
            TotalQuantity = 0;
            TotalHeld = 0;
            TotalWaste = 0;
            DeliveredOn = DateTime.Now;
            IsCompleted = false;
            TargetDepartmentId = 0;
        }

        public int Id { get; set; }
        public int JobTrackerId { get; set; }
        public int DepartmentId { get; set; }
        public int TargetDepartmentId { get; set; }
        
        public int TotalQuantity { get; set; }
        public int TotalHeld { get; set; }
        public int TotalWaste { get; set; }

        public string DeliveredById { get; set; }
        public DateTime DeliveredOn { get; set; }

        public string ConfirmedById { get; set; }
        public DateTime ConfirmedOn { get; set; }

        public bool IsCompleted { get; set; }
        public string Remark { get; set; }

        [ForeignKey("JobTrackerId")]
        public virtual JobTracker JobTracker { get; set; }

        [ForeignKey("DepartmentId")]
        public virtual Department Department { get; set; }

        [ForeignKey("TargetDepartmentId")]
        public virtual Department TargetDepartment { get; set; }

        [ForeignKey("DeliveredById")]
        public virtual ApplicationUser DeliveredBy { get; set; }

        [ForeignKey("ConfirmedById")]
        public virtual ApplicationUser ConfirmedBy { get; set; }
        
    }
}