using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace SID.Common.Model.Lookups
{
    public class SidProductImage
    {
        public int Id { get; set; }
        public int SidProductId { get; set; }
        public string ImageName { get; set; }

        [ForeignKey("SidProductId")]
        public SidProduct SidProduct { get; set; }
    }
}