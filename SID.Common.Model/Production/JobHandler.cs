using SID.Common.Model.Infrastructure;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace SID.Common.Model.Production
{
    public class JobHandler
    {
        public int Id { get; set; }
        public int JobTrackerId { get; set; }

        public int JobSplitId { get; set; }
        public string HandlerId { get; set; }
        public string Remark { get; set; }

        public DateTime CreatedOn { get; set; }
        public DateTime ModifiedOn { get; set; }

        [ForeignKey("JobSplitId")]
        public virtual JobSplit JobSplit { get; set; }

        [ForeignKey("HandlerId")]
        public virtual ApplicationUser Handler { get; set; }

        [ForeignKey("JobTrackerId")]
        public virtual JobTracker JobTracker { get; set; }
    }
}