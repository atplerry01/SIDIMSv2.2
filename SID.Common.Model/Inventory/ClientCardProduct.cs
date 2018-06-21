using SID.Common.Model.Lookups;
using System.ComponentModel.DataAnnotations.Schema;

namespace SID.Common.Model.Inventory
{
    public class ClientCardProduct
    {
        public int Id { get; set; }
        public int SidClientId { get; set; }
        public int SidCardTypeId { get; set; }
        public int SidChipTypeId { get; set; }

        public int Quantity { get; set; }
        public int ReOrderLevel { get; set; }
        public string ProductName { get; set; }
        public int ItemCode { get; set; }
        public string Description { get; set; }

        [ForeignKey("SidClientId")]
        public virtual SidClient SidClient { get; set; }

        [ForeignKey("SidCardTypeId")]
        public virtual SidCardType SidCardType { get; set; }

        [ForeignKey("SidChipTypeId")]
        public virtual SidChipType SidChipType { get; set; }

    }
}