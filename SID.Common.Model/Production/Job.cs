using SID.Common.Model.Lookups;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace SID.Common.Model.Production
{
    public class Job //: IAuditInfo
    {
        public Job()
        {
            IsJobPartial = false;
            SortingFile = false;
            CreatedOn = DateTime.Now;
            ModifiedOn = DateTime.Now;
            IsDeleted = false;
        }

        public int Id { get; set; }
        public string JobName { get; set; }
        public int SidClientId { get; set; }
        public int? RemarkId { get; set; }
        public int? ServiceTypeId { get; set; }
        public int SidCardTypeId { get; set; }
        public int JobStatusId { get; set; }
        public bool IsJobPartial { get; set; }

        public int Quantity { get; set; }
        public bool SortingFile { get; set; }

        public bool IsDeleted { get; set; }


        [ForeignKey("SidClientId")]
        public virtual SidClient SidClient { get; set; }

        [ForeignKey("SidCardTypeId")]
        public virtual SidCardType SidCardType { get; set; }

        [ForeignKey("ServiceTypeId")]
        public virtual ServiceType ServiceType { get; set; }

        [ForeignKey("JobStatusId")]
        public virtual JobStatus JobStatus { get; set; }

        [ForeignKey("RemarkId")]
        public virtual Remark Remark { get; set; }

        //// Audit Section
        public DateTime CreatedOn { get; set; }
        public DateTime ModifiedOn { get; set; }

    }
}