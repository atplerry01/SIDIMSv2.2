using SID.Common.Model.Infrastructure;
using SID.Common.Model.Lookups;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace SID.Common.Model.Production
{
    public class NonPersoJob
    {
        public NonPersoJob()
        {
            IsTreated = false;
            IsDeleted = false;
            Quantity = 0;
        }

        public int Id { get; set; }
        public int SidProductId { get; set; }
        public int ServiceTypeId { get; set; }
        public int Quantity { get; set; }
        public string JobName { get; set; }
        public string Description { get; set; }
        public bool IsTreated { get; set; }
        public bool IsDeleted { get; set; }

        public string CreatedById { get; set; }
        public string ModifiedById { get; set; }

        // Audit Section
        public DateTime CreatedOn { get; set; }
        public DateTime ModifiedOn { get; set; }


        [ForeignKey("SidProductId")]
        public virtual SidProduct SidProduct { get; set; }

        [ForeignKey("ServiceTypeId")]
        public virtual ServiceType ServiceType { get; set; }

        [ForeignKey("CreatedById")]
        public virtual ApplicationUser CreatedBy { get; set; }

        [ForeignKey("ModifiedById")]
        public virtual ApplicationUser ModifiedBy { get; set; }


    }
}