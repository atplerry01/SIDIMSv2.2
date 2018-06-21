using SID.Common.Model.Infrastructure;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace SID.Common.Model.Production
{
    public class Sid01CardOps //: IAuditInfo
    {

        public Sid01CardOps()
        {
            TimeIn = DateTime.Now;
            TimeOut = DateTime.Now;
        }

        public int Id { get; set; }
        public int JobId { get; set; }
        
        public string CreatedUserId { get; set; }
        public DateTime CreatedOn { get; set; }


        public DateTime TimeIn { get; set; }
        public DateTime TimeOut { get; set; }


        [ForeignKey("CreatedUserId")]
        public virtual ApplicationUser CreatedBy { get; set; }


        //// Audit Section
        //public DateTime CreatedOn { get; set; }
        //public DateTime ModifiedOn { get; set; }

    }
}