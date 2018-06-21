using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace SID.Common.Model.Lookups
{
    public class DictionaryServiceType
    {
        public int Id { get; set; }
        public int SidClientId { get; set; }
        public int SidCardTypeId { get; set; }
        public int ServiceTypeId { get; set; }
        public string ServiceCodeName { get; set; }

        [ForeignKey("SidClientId")]
        public virtual SidClient SidClient { get; set; }

        [ForeignKey("SidCardTypeId")]
        public virtual SidCardType SidCardType { get; set; }

        [ForeignKey("ServiceTypeId")]
        public virtual ServiceType ServiceType { get; set; }
    }
}