using SID.Common.Model.Infrastructure;
using SID.Common.Model.Lookups;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace SID.Common.Model.Production
{
    public class Sid07Mailing
    {
        public int Id { get; set; }
        public int JobId { get; set; }
        public int MailingModeId { get; set; }
        public int StartFrom { get; set; }
        public int EndPoint { get; set; }

        public string RunById { get; set; }
        public DateTime RunDate { get; set; }

        [ForeignKey("MailingModeId")]
        public virtual MailingMode MailingMode { get; set; }

        [ForeignKey("RunById")]
        public virtual ApplicationUser RunBy { get; set; }

        [ForeignKey("JobId")]
        public virtual Job Job { get; set; }

    }
}