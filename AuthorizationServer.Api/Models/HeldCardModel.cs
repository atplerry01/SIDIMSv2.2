using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AuthorizationServer.Api.Models
{
    public class HeldCardModel
    {
        public int JobTrackerId { get; set; }
        public int JobSplitId { get; set; }
        public int JobSplitCEAnalysisId { get; set; }

    }
}