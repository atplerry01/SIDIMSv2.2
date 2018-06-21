using SID.Common.Model.Infrastructure;
using SID.Common.Model.Lookups;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace SID.Common.Model.Production
{
    public class JobFlag
    {
        public int Id { get; set; }
        public int JobTrackerId { get; set; }
        public int FlagTypeId { get; set; }
        public int TargetUnitId { get; set; }
        public string Description { get; set; }
        public string Recommendation { get; set; }

        public string ResolvedById { get; set; }
        public string CreatedById { get; set; }
        public string ModifiedById { get; set; }

        public DateTime CreatedOn { get; set; }
        public DateTime ModifiedOn { get; set; }

        public bool IsResolved { get; set; }

        [ForeignKey("JobTrackerId")]
        public virtual JobTracker JobTracker { get; set; }

        [ForeignKey("FlagTypeId")]
        public virtual FlagType FlagType { get; set; }

        [ForeignKey("TargetUnitId")]
        public virtual Department TargetUnit { get; set; }

        [ForeignKey("ResolvedById")]
        public virtual ApplicationUser ResolvedBy { get; set; }

        [ForeignKey("CreatedById")]
        public virtual ApplicationUser CreatedBy { get; set; }

        [ForeignKey("ModifiedById")]
        public virtual ApplicationUser ModifiedBy { get; set; }


    }
}