namespace SID.Common.Model.Lookups
{
    public class Remark
    {
        public int Id { get; set; }
        public int SidClientId { get; set; }
        public SidClient SidClient { get; set; }

        public string Name { get; set; }
    }
}