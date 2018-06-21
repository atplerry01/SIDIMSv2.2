using SID.Common.Model.Infrastructure;
using SID.Common.Model.Lookups;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace SID.Common.Model.Production
{
    public class JobIssuanceLog
    {
        public int Id { get; set; }
        public int JobTrackerId { get; set; }
        public string IssuedById { get; set; }
        public string AcceptedById { get; set; }
        public int QuantityIssued { get; set; }
        public int IssuanceUnitId { get; set; }
        public DateTime TransactionDate { get; set; }


        [ForeignKey("JobTrackerId")]
        public virtual JobTracker JobTracker { get; set; }

        [ForeignKey("IssuedById")]
        public virtual ApplicationUser IssuedBy { get; set; }

        [ForeignKey("AcceptedById")]
        public virtual ApplicationUser AcceptedBy { get; set; }

        [ForeignKey("IssuanceUnitId")]
        public virtual IssuanceUnit IssuanceUnit { get; set; }

    }
}