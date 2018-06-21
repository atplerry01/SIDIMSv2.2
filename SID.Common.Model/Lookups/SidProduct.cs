using System.ComponentModel.DataAnnotations.Schema;

namespace SID.Common.Model.Lookups
{
    public class SidProduct
    {
        public SidProduct()
        {
            IsDeleted = false;
            HasImage = false;
        }

        public int Id { get; set; }
        public int SidClientId { get; set; }
        public int SidCardTypeId { get; set; }
        public string Variant { get; set; }

        public string Name { get; set; }
        public string ShortCode { get; set; }


        public bool IsDeleted { get; set; }
        public bool HasImage { get; set; }

        [ForeignKey("SidClientId")]
        public virtual SidClient SidClient { get; set; }

        [ForeignKey("SidCardTypeId")]
        public virtual SidCardType SidCardType { get; set; }

    }
}