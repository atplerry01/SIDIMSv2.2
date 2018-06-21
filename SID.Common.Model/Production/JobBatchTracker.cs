using SID.Common.Model.Inventory;
using SID.Common.Model.Lookups;
using System.ComponentModel.DataAnnotations.Schema;

namespace SID.Common.Model.Production
{
    public class JobBatchTracker
    {
        public int Id { get; set; }
        public int JobId { get; set; }
        public int JobTrackerId { get; set; }
        public int JobTrackerStatusId { get; set; }
        public int CardIssuanceId { get; set; } // Held Return Info


        [ForeignKey("JobId")]
        public virtual Job Job { get; set; }

        [ForeignKey("JobTrackerId")]
        public virtual JobTracker JobTracker { get; set; }

        [ForeignKey("JobTrackerStatusId")]
        public virtual JobTrackerStatus JobTrackerStatus { get; set; }

        [ForeignKey("CardIssuanceId")]
        public virtual CardIssuance CardIssuance { get; set; }

    }
}