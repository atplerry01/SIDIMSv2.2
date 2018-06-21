using SID.Common.Model.Infrastructure;
using SID.Common.Model.Production;
using System.ComponentModel.DataAnnotations.Schema;

namespace SID.Common.Model.Inventory
{
    public class CardIssuance //: IAuditInfo
    {
        // For a new Job
        // A one time record tie to a job
        public CardIssuance()
        {
            TotalQuantityRemain = 0;
            TotalWaste = 0;
            TotalHeld = 0;
        }

        public int Id { get; set; }
        public int JobId { get; set; }
        //public int JobTrackerId { get; set; }
        public int TotalQuantity { get; set; }
        public int TotalQuantityIssued { get; set; }
        public int TotalQuantityRemain { get; set; }
        public int TotalWaste { get; set; }
        public int TotalHeld { get; set; }

        public string IssuanceId { get; set; }
        public string CollectorId { get; set; }

        public int IssuanceStatusId { get; set; }

        [ForeignKey("JobId")]
        public virtual Job Job { get; set; }

        //[ForeignKey("JobTrackerId")]
        //public virtual JobTracker JobTracker { get; set; }

        [ForeignKey("IssuanceId")]
        public virtual ApplicationUser Issuance { get; set; }

        [ForeignKey("CollectorId")]
        public virtual ApplicationUser Collector { get; set; }
        
        //public virtual ICollection<CardIssuanceLog> CardIssuanceLogList { get; set; }

        //// Audit Section
        //public DateTime CreatedOn { get; set; }
        //public DateTime ModifiedOn { get; set; }

    }
}