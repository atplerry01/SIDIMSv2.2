using SID.Common.Model.Lookups;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace SID.Common.Model.Infrastructure
{
    public class ClientUser
    {
        public int Id { get; set; }
        public int SidClientId { get; set; }
        public string UserId { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime ModifiedOn { get; set; }

        [ForeignKey("SidClientId")]
        public virtual SidClient SidClient { get; set; }

        [ForeignKey("UserId")]
        public virtual ApplicationUser User { get; set; }
        
    }
}