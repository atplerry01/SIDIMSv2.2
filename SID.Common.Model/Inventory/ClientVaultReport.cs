using SID.Common.Model.Lookups;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace SID.Common.Model.Inventory
{
    public class ClientVaultReport
    {
        // This is just one report for a products

        public int Id { get; set; }
        public int SidProductId { get; set; }

        public int OpeningStock { get; set; }
        public int ClosingStock { get; set; }
        public DateTime ModifiedOn { get; set; }

        [ForeignKey("SidProductId")]
        public virtual SidProduct SidProduct { get; set; }

        //Audit Report

    }
}