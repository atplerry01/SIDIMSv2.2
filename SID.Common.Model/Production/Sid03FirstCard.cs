using SID.Common.Model.Infrastructure;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace SID.Common.Model.Production
{
    public class Sid03FirstCard
    {
        public int Id { get; set; }
        public int JobTrackerId { get; set; }

        public string InitializedById { get; set; }
        public DateTime InitializedOn { get; set; }

        [ForeignKey("JobTrackerId")]
        public virtual JobTracker JobTracker { get; set; }

        [ForeignKey("InitializedById")]
        public virtual ApplicationUser InitializedBy { get; set; }


    }
}