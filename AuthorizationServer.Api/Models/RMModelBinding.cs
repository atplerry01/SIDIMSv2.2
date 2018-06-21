using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AuthorizationServer.Api.Models
{
    public class NonPersoModel
    {
        public int SectorId { get; set; }
        public int ClientId { get; set; }
        public int SidProductId { get; set; }
        public int ServiceTypeId { get; set; }
        public int Quantity { get; set; }
        public string JobName { get; set; }
        public string Description { get; set; }
    }
}