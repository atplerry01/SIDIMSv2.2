using SID.Common.Model.Infrastructure;
using SID.Common.Model.Lookups;
using SID.Common.Model.Production;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace SID.Common.Model.Inventory
{
    public class CardIssuanceLog
    {
        // For other partial Issuance
        // List of all issues and update the CardIssance
        public CardIssuanceLog()
        {
            IsDeleted = false;
        }

        public int Id { get; set; }
        public int CardIssuanceId { get; set; }
        public int JobTrackerId { get; set; }
        public int IssuanceTypeId { get; set; }
        
        public int TotalQuantity { get; set; }
        public int QuantityIssued { get; set; }
        public int QuantityRemain { get; set; }

        public string IssuanceId { get; set; } 
        public string CollectorId { get; set; }
        public bool IsDeleted { get; set; }

        [ForeignKey("CardIssuanceId")]
        public virtual CardIssuance CardIssuance { get; set; }

        [ForeignKey("JobTrackerId")]
        public virtual JobTracker JobTracker { get; set; }

        [ForeignKey("IssuanceTypeId")]
        public virtual IssuanceType IssuanceType { get; set; }

        [ForeignKey("IssuanceId")]
        public virtual ApplicationUser Issuance { get; set; }

        [ForeignKey("CollectorId")]
        public virtual ApplicationUser Collector { get; set; }

        public DateTime IssuedDate { get; set; }


        //Audit
    }
}