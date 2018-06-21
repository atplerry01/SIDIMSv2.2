using SID.Common.Model.Infrastructure;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace SID.Common.Model.Production
{
    public class Sid04Printing
    {
        public int Id { get; set; }
        public int JobTrackerId { get; set; }

        public string InitializedById { get; set; }
        public DateTime CompletedOn { get; set; }

        [ForeignKey("JobTrackerId")]
        public virtual JobTracker JobTracker { get; set; }

        [ForeignKey("InitializedById")]
        public virtual ApplicationUser InitializedBy { get; set; }
        

    }
}