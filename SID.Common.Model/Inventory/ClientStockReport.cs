using SID.Common.Model.Lookups;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace SID.Common.Model.Inventory
{
    public class ClientStockReport
    {

        /// DailyReportLog, 
       
        public int Id { get; set; }
        public int SidProductId { get; set; }
        public int ClientVaultReportId { get; set; }

        public string FileName { get; set; }

        public int QtyIssued { get; set; }

        public int TotalQtyIssued { get; set; }
        public int WasteQty { get; set; }
        public int ReturnQty { get; set; }

        public int OpeningStock { get; set; }
        public int ClosingStock { get; set; }

        public DateTime CreatedOn { get; set; }

        [ForeignKey("SidProductId")]
        public virtual SidProduct SidProduct { get; set; }

        [ForeignKey("ClientVaultReportId")]
        public virtual ClientVaultReport ClientVaultReport { get; set; }

    }
}