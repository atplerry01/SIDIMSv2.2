using SID.Common.Model.Lookups;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace SID.Common.Model.Production
{
    public class JobTracker //:IAuditInfo
    {
        public JobTracker()
        {
            //StageRequired = 1;
            //CurrentState = 1;
            TAT = 0;
            IsPartial = false;
            IsCompleted = false;
            IsFlag = false;

            CreatedOn = DateTime.Now;
            ModifiedOn = DateTime.Now;
            IsDeleted = false;
        }

        public int Id { get; set; }
        public int JobId { get; set; }

        public int CardOpsId { get; set; }
        public int InventoryId { get; set; }
        public int PrintingId { get; set; }
        public int PrintQAId { get; set; }
        public int PrintQCId { get; set; }
        public int CardEngrId { get; set; }
        public int QAId { get; set; }
        public int FirstJobRunId { get; set; }
        public int CardEngrResumeId { get; set; }
        public int QCId { get; set; }
        public int MailingId { get; set; }
        public int DispatchId { get; set; }
        public int MAudId { get; set; }
        public int CustomerServiceId { get; set; }
        public int JobStatusId { get; set; }
        public float TAT { get; set; }


        public bool IsPartial { get; set; } 
        public bool IsFlag { get; set; }
        public bool IsCompleted { get; set; }
        public bool IsDeleted { get; set; }


        [ForeignKey("CardOpsId")]
        public virtual JobStatus Stage01CardOps { get; set; }

        [ForeignKey("InventoryId")]
        public virtual JobStatus Stage02Inventory { get; set; }

        [ForeignKey("PrintingId")]
        public virtual JobStatus Stage03Printing { get; set; }

        [ForeignKey("PrintQAId")]
        public virtual JobStatus Stage03PrintQA { get; set; }

        [ForeignKey("PrintQCId")]
        public virtual JobStatus Stage03PrintQC { get; set; }

        [ForeignKey("CardEngrId")]
        public virtual JobStatus Stage04CardEngr { get; set; }

        [ForeignKey("QAId")]
        public virtual JobStatus Stage05QA { get; set; }

        [ForeignKey("FirstJobRunId")]
        public virtual JobStatus Stage06FirstJobRun { get; set; }

        [ForeignKey("CardEngrResumeId")]
        public virtual JobStatus Stage07CardEngrResume { get; set; }

        [ForeignKey("QCId")]
        public virtual JobStatus Stage08QC { get; set; }

        [ForeignKey("MailingId")]
        public virtual JobStatus Stage09Mailing { get; set; }

        [ForeignKey("DispatchId")]
        public virtual JobStatus Stage10Dispatch { get; set; }

        [ForeignKey("MAudId")]
        public virtual JobStatus Stage10MaterialAudit { get; set; }

        [ForeignKey("CustomerServiceId")]
        public virtual JobStatus Stage11CustomerService { get; set; }
        
        [ForeignKey("JobId")]
        public virtual Job Job { get; set; }

        [ForeignKey("JobStatusId")]
        public virtual JobStatus JobStatus { get; set; }


        //// Audit Section
        public DateTime CreatedOn { get; set; }
        public DateTime ModifiedOn { get; set; }

    }
}