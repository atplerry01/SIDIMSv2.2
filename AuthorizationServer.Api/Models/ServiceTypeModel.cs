using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AuthorizationServer.Api.Models
{
    public class ServiceTypeModel
    {
        public int JobId { get; set; }
        public int JobTrackerId { get; set; }
        public int ServiceTypeId { get; set; }
    }
}