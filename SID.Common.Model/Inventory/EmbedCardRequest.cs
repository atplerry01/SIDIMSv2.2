using SID.Common.Model.Infrastructure;
using SID.Common.Model.Lookups;
using System.ComponentModel.DataAnnotations.Schema;

namespace SID.Common.Model.Inventory
{
    public class EmbedCardRequest
    {
        public EmbedCardRequest()
        {
            TotalDelivered = 0;
        }

        public int Id { get; set; }
        public int SidProductId { get; set; }
        public int? OrderNumber { get; set; }
        public int TotalBatchQty { get; set; }
        public int TotalDelivered { get; set; }
        public string CreatedById { get; set; }


        [ForeignKey("SidProductId")]
        public virtual SidProduct SidProduct { get; set; }
        
        [ForeignKey("CreatedById")]
        public virtual ApplicationUser CreatedBy { get; set; }

        //public DateTime CreatedOn { get; set; }

    }
}