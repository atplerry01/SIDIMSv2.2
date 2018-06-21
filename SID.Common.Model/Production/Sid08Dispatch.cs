using SID.Common.Model.Infrastructure;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace SID.Common.Model.Production
{
    public class Sid08Dispatch
    {
        public Sid08Dispatch()
        {
            IsNoteGenerated = false;
        }

        public int Id { get; set; }
        public int JobId { get; set; }
        //public int JobBatchTrackerId { get; set; }
        public string ReceivedById { get; set; }
        public DateTime ReceivedOn { get; set; }
        public bool IsNoteGenerated { get; set; }

        [ForeignKey("JobId")]
        public virtual Job Job { get; set; }

        //[ForeignKey("JobBatchTrackerId")]
        //public virtual JobBatchTracker JobBatchTracker { get; set; }

        [ForeignKey("ReceivedById")]
        public virtual ApplicationUser ReceivedBy { get; set; }

    }
}