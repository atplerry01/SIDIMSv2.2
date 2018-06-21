using System.ComponentModel.DataAnnotations.Schema;

namespace SID.Common.Model.Lookups
{
    public class SidChipType
    {
        public int Id { get; set; }
        public int SidCardTypeId { get; set; }
        public string Name { get; set; }

        [ForeignKey("SidCardTypeId")]
        public virtual SidCardType SidCardType { get; set; }

    }
}