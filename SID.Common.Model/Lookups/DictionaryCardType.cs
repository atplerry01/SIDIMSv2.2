using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace SID.Common.Model.Lookups
{
    public class DictionaryCardType
    {
        public int Id { get; set; }
        public int SidCardTypeId { get; set; }

        public string CardCodeName { get; set; }

        [ForeignKey("SidCardTypeId")]
        public virtual SidCardType SidCardType { get; set; }
    }
}