using System.ComponentModel.DataAnnotations.Schema;

namespace SID.Common.Model.Inventory
{
    public class ClientStockLog
    {
        // This is attached to the daily ClientStockReport for the day
        public int Id { get; set; }
        public int ClientStockReportId { get; set; } //for today
        public int CardIssuanceId { get; set; }

        public int IssuanceQty { get; set; }
        public int OpeningStock { get; set; }
        public int ClosingStock { get; set; }


        [ForeignKey("ClientStockReportId")]
        public virtual ClientStockReport ClientStockReport { get; set; }

        [ForeignKey("CardIssuanceId")]
        public virtual CardIssuance CardIssuance { get; set; }

    }
}