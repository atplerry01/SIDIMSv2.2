using SID.Common.Model.Infrastructure;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace SID.Common.Model.Production
{
    public class Sid03CardEngr
    {
        public int Id { get; set; }
        public int JobId { get; set; }
        public string ResumedById { get; set; }
        public DateTime ResumedOn { get; set; }

        [ForeignKey("JobId")]
        public virtual Job Job { get; set; }

        [ForeignKey("ResumedById")]
        public virtual ApplicationUser ResumedBy { get; set; }

    }
}