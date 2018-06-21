using SID.Common.Model.Lookups;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AuthorizationServer.Api.Models
{
    public class JobModel
    {
        public int Id { get; set; }
        public string JobName { get; set; }
        public int SidClientId { get; set; }
        public int RemarkId { get; set; }
        public int SidCardTypeId { get; set; }
        public int Quantity { get; set; }
        public string JobType { get; set; }
    }
}