using SID.Common.Model.Infrastructure;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace SID.Common.Model.Production
{
    public class Sid06QC
    {
        public int Id { get; set; }
        public int JobTrackerId { get; set; }
        public int StartFrom { get; set; }
        public int EndPoint { get; set; }

        public string RunById { get; set; }
        public DateTime RunDate { get; set; }

        [ForeignKey("RunById")]
        public virtual ApplicationUser RunBy { get; set; }

        [ForeignKey("JobTrackerId")]
        public virtual JobTracker JobTracker { get; set; }

    }
}