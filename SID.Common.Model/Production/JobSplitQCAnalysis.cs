using SID.Common.Model.Infrastructure;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace SID.Common.Model.Production
{
    public class JobSplitQCAnalysis
    {
        public JobSplitQCAnalysis()
        {
            IsVerified = false;
            QuantityBad = 0;
            QuantityGood = 0;
            QuantityHeld = 0;
            CreatedOn = DateTime.Now;
        }

        public int Id { get; set; }
        public int JobSplitId { get; set; }

        public int QuantityGood { get; set; }
        public int QuantityHeld { get; set; }
        public int QuantityBad { get; set; }

        public bool IsVerified { get; set; }

        public string CreatedById { get; set; }
        public DateTime CreatedOn { get; set; }

        [ForeignKey("JobSplitId")]
        public virtual JobSplit JobSplit { get; set; }

        [ForeignKey("CreatedById")]
        public virtual ApplicationUser CreatedBy { get; set; }
    }
}