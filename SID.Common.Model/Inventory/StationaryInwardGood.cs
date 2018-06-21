using System;

namespace SID.Common.Model.Inventory
{
    public class StationaryInwardGood
    {
        public int Id { get; set; }
        public string GoodsName { get; set; }
        public int Quantity { get; set; }
        
        public DateTime TimeOfReceipt { get; set; }
        public string GoodsFrom { get; set; }
        public string Attention { get; set; }
        public string BroughtBy { get; set; }
        public string ReceivedBy { get; set; }
        
        //[ForeignKey("EmbedCardRequestId")]
        //public virtual EmbedCardRequest EmbedCardRequest { get; set; }

        //[ForeignKey("SCMSupplierId")]
        //public virtual ApplicationUser SCMSupplier { get; set; }

        //[ForeignKey("SIDReceiverId")]
        //public virtual ApplicationUser SIDReceiver { get; set; }
    }
}