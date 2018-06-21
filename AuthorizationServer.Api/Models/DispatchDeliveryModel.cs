using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AuthorizationServer.Api.Models
{
    public class DispatchDeliveryModel
    {
        public int Id { get; set; }
        public int CardDeliveryLogId { get; set; }
        public int SidClientId { get; set; }
        public int JobTrackerId { get; set; }
        public bool IsNoteGenerated { get; set; }


        public int RangeFrom { get; set; }
        public int RangeTo { get; set; }

        public string CreatedById { get; set; }
        public DateTime CreatedOn { get; set; }

    }
}