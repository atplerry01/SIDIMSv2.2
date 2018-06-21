using SID.Common.Model.Infrastructure;
using SID.Common.Model.Lookups;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace SID.Common.Model.Inventory
{
    public class StockStatus
    {
        /// <summary>
        /// // One time report of StockStatus for ClientVariant
        /// </summary>

        public StockStatus()
        {
            OpeningStock = 0;
            TotalDataReceived = 0;
        }

        public int Id { get; set; }
        public int SidClientId { get; set; } //Todo: Tobe removed,  Stock tie to Client including SID
        public int SidVariantId { get; set; } //
        public int CardIssuanceId { get; set; }

        public int TotalDataReceived { get; set; }
        public int OpeningStock { get; set; }
        public int NewStock { get; set; }
        public int TotalIssued { get; set; }
        public int TotalDelivered { get; set; }
        public int TotalProductionSpoil { get; set; }
        public int TotalWasteSent { get; set; }
        public string CardIssuedById { get; set; }
        public string CardCollectedById { get; set; }

        public DateTime CreatedOn { get; set; }

        [ForeignKey("SidClientId")]
        public virtual SidClient SidClient { get; set; }

        [ForeignKey("SidVariantId")]
        public virtual SidVariant SidVariant { get; set; }

        [ForeignKey("CardIssuedById")]
        public virtual ApplicationUser CardIssuedBy { get; set; }
        
        [ForeignKey("CardCollectedById")]
        public virtual ApplicationUser CardCollectedBy { get; set; }



    }
}