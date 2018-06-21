using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace SID.Common.Model.Inventory
{
    public class CardStockLog
    {
        public int Id { get; set; }

        // CardIssuanceLogId
        // ClientStockLog
        public int ClientStockLogId { get; set; }
        public int OpeningStock { get; set; }
        public int QuantityIssued { get; set; }
        public int ClosingStock { get; set; }

        public DateTime IssuedDate { get; set; }

        [ForeignKey("ClientStockLogId")]
        public virtual ClientStockLog ClientStockLog { get; set; }

    }
}