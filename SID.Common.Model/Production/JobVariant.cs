using SID.Common.Model.Lookups;
using System.ComponentModel.DataAnnotations.Schema;

namespace SID.Common.Model.Production
{
    public class JobVariant
    {
        public int Id { get; set; }
        public int JobId { get; set; }
        public int JobTrackerId { get; set; }
        public int SidProductId { get; set; }
        public int ServiceTypeId { get; set; }


        [ForeignKey("JobId")]
        public virtual Job Job { get; set; }

        [ForeignKey("JobTrackerId")]
        public virtual JobTracker JobTracker { get; set; }

        [ForeignKey("SidProductId")]
        public virtual SidProduct SidProduct { get; set; }

        [ForeignKey("ServiceTypeId")]
        public virtual ServiceType ServiceType { get; set; }

    }
}