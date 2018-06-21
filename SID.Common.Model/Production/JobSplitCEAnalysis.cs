using SID.Common.Model.Infrastructure;
using SID.Common.Model.Lookups;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace SID.Common.Model.Production
{
    public class JobSplitCEAnalysis
    {
        public JobSplitCEAnalysis()
        {
            QuantityBad = 0;
            QuantityGood = 0;
            QuantityHeld = 0;

            CreatedOn = DateTime.Now;
            ModifiedOn = DateTime.Now;

            IsCEInitialized = false;
            IsQCInitialized = false;
            IsJobHandleByCE = false;
            IsJobHandleByQC = false;

            HeldReturned = 0;
            WasteReturned = 0;
            ConfirmedHeld = 0;
        }

        public int Id { get; set; }
        public int JobTrackerId { get; set; }
        public int JobSplitId { get; set; }

        public int QuantityGood { get; set; }
        public int QuantityHeld { get; set; }
        public int QuantityBad { get; set; }
        public int ConfirmedHeld { get; set; }
        public bool IsCEInitialized { get; set; }
        public bool IsQCInitialized { get; set; }

        public int HeldReturned { get; set; }
        public int WasteReturned { get; set; }

        public string CreatedById { get; set; }
        public DateTime CreatedOn { get; set; }
        public string ModifiedById { get; set; }
        public DateTime ModifiedOn { get; set; }

        public bool IsJobHandleByCE { get; set; }
        public bool IsJobHandleByQC { get; set; }


        [ForeignKey("JobSplitId")]
        public virtual JobSplit JobSplit { get; set; }

        [ForeignKey("JobTrackerId")]
        public virtual JobTracker JobTracker { get; set; }

        [ForeignKey("CreatedById")]
        public virtual ApplicationUser CreatedBy { get; set; }

        [ForeignKey("ModifiedById")]
        public virtual ApplicationUser ModifiedBy { get; set; }

    }
}