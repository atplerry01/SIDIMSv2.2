using SID.Common.Model.Production;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace SID.Common.Model.Inventory
{
  
    public class WasteDeliveryNoteLog
    {
        public WasteDeliveryNoteLog()
        {
            AuditStatus = false;
            CustomerServiceStatus = false;
        }

        public int Id { get; set; }
        public int CardWasteAnalysisId { get; set; }
        public int WasteDeliveryNoteId { get; set; }

        public bool AuditStatus { get; set; }
        public bool CustomerServiceStatus { get; set; }
        
        [ForeignKey("CardWasteAnalysisId")]
        public virtual CardWasteAnalysis CardWasteAnalysis { get; set; }

        [ForeignKey("WasteDeliveryNoteId")]
        public virtual WasteDeliveryNote WasteDeliveryNote { get; set; }
        
    }

}