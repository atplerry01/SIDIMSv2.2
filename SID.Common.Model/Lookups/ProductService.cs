using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace SID.Common.Model.Lookups
{
    public class ProductService
    {
        public ProductService()
        {
            Priority = 0;
        }

        public int Id { get; set; }
        public int SidProductId { get; set; }
        public int ServiceTypeId { get; set; }
        public int? Priority { get; set; }


        [ForeignKey("SidProductId")]
        public SidProduct SidProduct { get; set; }

        [ForeignKey("ServiceTypeId")]
        public ServiceType ServiceType { get; set; }
    }
}