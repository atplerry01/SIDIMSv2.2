using System.ComponentModel.DataAnnotations.Schema;

namespace SID.Common.Model.Lookups
{
    public class SidClient
    {
        public int Id { get; set; }
        public int SectorId { get; set; }
        public string Name { get; set; }
        public string ShortCode { get; set; }

        [ForeignKey("SectorId")]
        public virtual SidSector Sector { get; set; }

    }
}