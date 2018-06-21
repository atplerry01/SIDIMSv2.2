using SID.Common.Model.Infrastructure;
using SID.Common.Model.Lookups;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace SID.Common.Model.Production
{
    public class PrintWasteAnalysis
    {
        public PrintWasteAnalysis()
        {
            IsCardCollected = false;
            IsWasteDispatch = false;

            CreatedOn = DateTime.Now;
            ModifiedOn = DateTime.Now;
        }

        public int Id { get; set; }
        public int JobTrackerId { get; set; }
        public int JobSplitId { get; set; }
        public int JobSplitPrintCEAnalysisId { get; set; }

        public int QuantityBad { get; set; }
        public int WasteErrorSourceId { get; set; }
        public int WasteByUnitId { get; set; }

        public bool IsCardCollected { get; set; }
        public bool IsWasteDispatch { get; set; }

        public string CreatedById { get; set; }
        public DateTime CreatedOn { get; set; }
        public string ModifiedById { get; set; }
        public DateTime ModifiedOn { get; set; }


        [ForeignKey("WasteByUnitId")]
        public virtual Department WasteByUnit { get; set; }

        [ForeignKey("JobSplitId")]
        public virtual JobSplit JobSplit { get; set; }

        [ForeignKey("JobSplitPrintCEAnalysisId")]
        public virtual JobSplitPrintCEAnalysis JobSplitPrintCEAnalysis { get; set; }

        [ForeignKey("JobTrackerId")]
        public virtual JobTracker JobTracker { get; set; }

        [ForeignKey("CreatedById")]
        public virtual ApplicationUser CreatedBy { get; set; }

        [ForeignKey("ModifiedById")]
        public virtual ApplicationUser ModifiedBy { get; set; }

        [ForeignKey("WasteErrorSourceId")]
        public virtual WasteErrorSource WasteErrorSource { get; set; }

    }
}