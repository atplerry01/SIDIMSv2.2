using SID.Common.Model.Infrastructure;
using System.ComponentModel.DataAnnotations.Schema;

namespace SID.Common.Model.Production
{
    public class Customer //: IAuditInfo
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string OfficeAddress { get; set; }
        public string ContactPerson { get; set; }
        public string PhoneNumber { get; set; }
        public float WasteAllowed { get; set; }
        public int SLAQuality { get; set; }
        public int SLATime { get; set; }

        public string CreatedUserId { get; set; }
        public string ModifiedUserId { get; set; }


        [ForeignKey("CreatedUserId")]
        public virtual ApplicationUser CreatedBy { get; set; }

        [ForeignKey("ModifiedUserId")]
        public virtual ApplicationUser ModifiedBy { get; set; }

        //// Audit Section
        //public DateTime CreatedOn { get; set; }
        //public DateTime ModifiedOn { get; set; }
        
    }
}