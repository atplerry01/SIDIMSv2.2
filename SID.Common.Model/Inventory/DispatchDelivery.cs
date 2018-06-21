using SID.Common.Model.Infrastructure;
using SID.Common.Model.Lookups;
using SID.Common.Model.Production;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace SID.Common.Model.Inventory
{
    public class DispatchDelivery // replace sidDispatch
    {
        public DispatchDelivery()
        {
            IsNoteGenerated = false;
        }

        public int Id { get; set; }
        public int SidClientId { get; set; }
        public int JobTrackerId { get; set; }
        public bool IsNoteGenerated { get; set; }

        public int RangeFrom { get; set; }
        public int RangeTo { get; set; }

        public string CreatedById { get; set; }
        public DateTime CreatedOn { get; set; }


        [ForeignKey("SidClientId")]
        public virtual SidClient SidClient { get; set; }

        [ForeignKey("JobTrackerId")]
        public virtual JobTracker JobTracker { get; set; }

        [ForeignKey("CreatedById")]
        public virtual ApplicationUser CreatedBy { get; set; }

    }
}