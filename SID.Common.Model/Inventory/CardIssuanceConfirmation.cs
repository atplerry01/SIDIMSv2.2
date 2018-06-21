using SID.Common.Model.Infrastructure;
using SID.Common.Model.Production;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace SID.Common.Model.Inventory
{
    public class CardIssuanceConfirmation
    {
        public CardIssuanceConfirmation() {
            IsReceived = false;
        }

        public int Id { get; set; }
        public int JobId { get; set; }
        //public int JobBatchTrackerId { get; set; }
        public int CardIssuanceLogId { get; set; }

        public bool IsReceived { get; set; }

        public string ConfirmedById { get; set; }
        public DateTime ConfirmationDate { get; set; }


        [ForeignKey("JobId")]
        public virtual Job Job { get; set; }

        //[ForeignKey("JobBatchTrackerId")]
        //public virtual JobBatchTracker JobBatchTracker { get; set; }

        [ForeignKey("CardIssuanceLogId")]
        public virtual CardIssuanceLog CardIssuanceLog { get; set; }

        [ForeignKey("ConfirmedById")]
        public virtual ApplicationUser ConfirmedBy { get; set; }

    }
}