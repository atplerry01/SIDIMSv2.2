using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AuthorizationServer.Api.Models
{
    public class VehicleTest
    {
        public string MakeName { get; set; }
        public string ModelName { get; set; }
        public string Chasisno { get; set; }
        public string DateRegistered { get; set; }
        public string vehiclestatus { get; set; }

        public virtual VehicleHistory VehicleHistory { get; set; }
        public virtual InsuranceHistory InsuranceHistory { get; set; }

    }
}