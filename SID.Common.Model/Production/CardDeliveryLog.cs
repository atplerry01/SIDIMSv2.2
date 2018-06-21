using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;
using SID.Common.Model.Infrastructure;

namespace SID.Common.Model.Production
{
    public class CardDeliveryLog
    {
        public CardDeliveryLog()
        {
            IsConfirmed = false;
            IsDeleted = false;
            BoxQty = 1;
        }

        public int Id { get; set; }
        public int JobTrackerId { get; set; }
        public int CardDeliveryId { get; set; }

        public int RangeFrom { get; set; }
        public int RangeTo { get; set; }

        public bool IsConfirmed { get; set; }
        public bool IsDeleted { get; set; }

        public string CreatedById { get; set; }
        public DateTime CreatedOn { get; set; }
        public string ConfirmedById { get; set; }
        public DateTime ConfirmedOn { get; set; }

        public string Description { get; set; }
        public int? BoxQty { get; set; }

        [ForeignKey("JobTrackerId")]
        public virtual JobTracker JobTracker { get; set; }

        [ForeignKey("CardDeliveryId")]
        public virtual CardDelivery CardDelivery { get; set; }

        [ForeignKey("CreatedById")]
        public virtual ApplicationUser CreatedBy { get; set; }

        [ForeignKey("ConfirmedById")]
        public virtual ApplicationUser ConfirmedBy { get; set; }

    }
}