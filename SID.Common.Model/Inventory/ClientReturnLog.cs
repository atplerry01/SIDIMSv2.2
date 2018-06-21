using System.ComponentModel.DataAnnotations.Schema;

namespace SID.Common.Model.Inventory
{
    public class ClientReturnLog
    {
        public int Id { get; set; }
        public int ClientStockReportId { get; set; }

        public int IssuanceQty { get; set; }
        public int OpeningStock { get; set; }
        public int ClosingStock { get; set; }


        [ForeignKey("ClientStockReportId")]
        public virtual ClientStockReport ClientStockReport { get; set; }

    }
}