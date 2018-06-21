using SID.Common.Model.Infrastructure;
using SID.Common.Model.Lookups;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace SID.Common.Model.Production
{
    public class JobSplit
    {
        public  JobSplit()
        {
            IsQACompleted = false;
            IsCECompleted = false;
            IsQCCompleted = false;
            IsMACompleted = false;
            CreatedOn = DateTime.Now;
            ModifiedOn = DateTime.Now;
        }

        public int Id { get; set; }
        public int JobTrackerId { get; set; }
        public int DepartmentId { get; set; }
        public int SidMachineId { get; set; }
        public int RangeFrom { get; set; }
        public int RangeTo { get; set; }

        public bool IsQACompleted { get; set; }
        public bool IsCECompleted { get; set; }
        public bool IsQCCompleted { get; set; }
        public bool IsMACompleted { get; set; }

        public string CreatedById { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime ModifiedOn { get; set; }

        [ForeignKey("JobTrackerId")]
        public virtual JobTracker JobTracker { get; set; }

        [ForeignKey("DepartmentId")]
        public virtual Department Department { get; set; }

        [ForeignKey("SidMachineId")]
        public virtual SidMachine SidMachine { get; set; }

        //Audit
        [ForeignKey("CreatedById")]
        public virtual ApplicationUser CreatedBy { get; set; }


    }
}