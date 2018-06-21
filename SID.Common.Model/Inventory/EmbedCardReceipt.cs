using SID.Common.Model.Infrastructure;
using SID.Common.Model.Lookups;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace SID.Common.Model.Inventory
{
    public class EmbedCardReceipt
    {
        public int Id { get; set; }
        public int SidProductId { get; set; }
        public int EmbedCardRequestId { get; set; }
        public int ClientVaultReportId { get; set; }
        public int VendorId { get; set; }
        public string SIDReceiverId { get; set; }
        
        public string SupplierName { get; set; }

        public string LotNumber { get; set; }
        public int Quantity { get; set; }
        public DateTime TimeOfReceipt { get; set; }
        public string Remark { get; set; }


        [ForeignKey("SidProductId")]
        public virtual SidProduct SidProduct { get; set; }

        [ForeignKey("EmbedCardRequestId")]
        public virtual EmbedCardRequest EmbedCardRequest { get; set; }

        [ForeignKey("VendorId")]
        public virtual Vendor Vendor { get; set; }

        [ForeignKey("SIDReceiverId")]
        public virtual ApplicationUser SIDReceiver { get; set; }



    }
}