using SID.Common.Model.Infrastructure;
using SID.Common.Model.Lookups;
using SID.Common.Model.Production;
using System.ComponentModel.DataAnnotations.Schema;

namespace SID.Common.Model.Inventory
{
    public class JobWasteLog
    {
        public int Id { get; set; }
        public int JobWasteId { get; set; }
        public int JobId { get; set; }
        public int WasteTypeId { get; set; }
        public int DepartmentId { get; set; }
        public int WasteQuantity { get; set; }
        public string CreatedById { get; set; }

        [ForeignKey("JobId")]
        public virtual Job Job { get; set; }

        [ForeignKey("JobWasteId")]
        public virtual JobWaste JobWaste { get; set; }

        [ForeignKey("WasteTypeId")]
        public virtual WasteType WasteType { get; set; }

        [ForeignKey("CreatedById")]
        public virtual ApplicationUser CreatedBy { get; set; }


        // Audit
    }
}