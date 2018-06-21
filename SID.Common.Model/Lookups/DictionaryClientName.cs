using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace SID.Common.Model.Lookups
{
    public class DictionaryClientName
    {
        public int Id { get; set; }
        public int SidClientId { get; set; }
        public string ClientCodeName { get; set; }

        [ForeignKey("SidClientId")]
        public virtual SidClient SidClient { get; set; }

    }
}