using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace SID.Common.Model.Lookups
{
    public class WasteErrorSourceCode
    {
        public int Id { get; set; }
        public int WasteErrorSourceId { get; set; }
        public string Name { get; set; }
        
        [ForeignKey("WasteErrorSourceId")]
        public virtual WasteErrorSource WasteErrorSource { get; set; }
        
    }
}