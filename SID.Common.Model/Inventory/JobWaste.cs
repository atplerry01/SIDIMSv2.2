using SID.Common.Model.Infrastructure;
using SID.Common.Model.Lookups;
using SID.Common.Model.Production;
using System.ComponentModel.DataAnnotations.Schema;

namespace SID.Common.Model.Inventory
{
    public class JobWaste
    {
        public JobWaste()
        {
            IsDispatch = false;
        }

        public int Id { get; set; }
        public int JobId { get; set; }
        public int WasteTypeId { get; set; }
        public int DepartmentId { get; set; }
        public int TotalWasteQuantity { get; set; }
        public int PendingWasteQuantity { get; set; }
        public string CreatedById { get; set; }
        public bool IsDispatch { get; set; }

        [ForeignKey("JobId")]
        public virtual Job Job { get; set; }

        [ForeignKey("WasteTypeId")]
        public virtual WasteType WasteType { get; set; }

        [ForeignKey("DepartmentId")]
        public virtual Department Department { get; set; }

        [ForeignKey("CreatedById")]
        public virtual ApplicationUser CreatedBy { get; set; }


    }
}