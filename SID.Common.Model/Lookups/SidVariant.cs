namespace SID.Common.Model.Lookups
{
    public class SidVariant
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string ShortCode { get; set; }



        //public int SidProductId { get; set; }

        //[ForeignKey("SidProductId")]
        //public virtual SidProduct SidProduct { get; set; }

        //public int SidClientId { get; set; }
        //public int SidCardTypeId { get; set; }

        //[ForeignKey("SidClientId")]
        //public virtual SidClient SidClient { get; set; }
        //[ForeignKey("SidCardTypeId")]
        //public virtual SidCardType SidCardType { get; set; }
        
    }
}