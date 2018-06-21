using SID.Common.Model.Infrastructure;
using SID.Common.Model.Lookups;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace SID.Common.Model.Production
{
    public class JobBadCardApproval
    {
        public JobBadCardApproval()
        {

            QuantityIssued = 0;

            CreatedOn = DateTime.Now;
            IssuedDate = DateTime.Now;
            IsBadCardIssued = false;
        }

        public int Id { get; set; }
        public int JobSplitId { get; set; }
        public int JobSplitCEAnalysisId { get; set; }

        public bool IsBadCardIssued { get; set; }
        public int WasteErrorSourceId { get; set; }
        public int QuantityIssued { get; set; }

        public string CreatedById { get; set; }
        public DateTime CreatedOn { get; set; }

        public string IssuedById { get; set; }
        public DateTime IssuedDate { get; set; }

        [ForeignKey("JobSplitId")]
        public virtual JobSplit JobSplit { get; set; }
        
        [ForeignKey("WasteErrorSourceId")]
        public virtual WasteErrorSource WasteErrorSource { get; set; }

        [ForeignKey("JobSplitCEAnalysisId")]
        public virtual JobSplitCEAnalysis JobSplitCEAnalysis { get; set; }

        [ForeignKey("CreatedById")]
        public virtual ApplicationUser CreatedBy { get; set; }

        [ForeignKey("IssuedById")]
        public virtual ApplicationUser IssuedBy { get; set; }
        
    }
}