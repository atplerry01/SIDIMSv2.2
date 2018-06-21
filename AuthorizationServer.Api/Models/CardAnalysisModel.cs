using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AuthorizationServer.Api.Models
{
    public class CardAnalysisModel
    {
        public int CardCEAnalysisId { get; set; }
        public int JobTrackerId { get; set; }
        public int JobSplitId { get; set; }
        public int JobSplitCEAnalysisId { get; set; }
        public int WasteErrorSourceId { get; set; }
        public int WasteByUnitId { get; set; }

        public int QuantityBad { get; set; }
        public int QuantityHeld { get; set; }
        
    }
}