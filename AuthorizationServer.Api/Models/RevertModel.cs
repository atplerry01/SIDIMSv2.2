using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AuthorizationServer.Api.Models
{
    public class RevertModel
    {
        public int JobTrackerId { get; set; }
        public int DepartmentId { get; set; }
    }
}