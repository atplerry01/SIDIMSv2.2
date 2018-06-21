namespace SID.Common.Model.Lookups
{
    public class DeliveryProfile
    {
        public int Id { get; set; }
        public int SidClientId { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        public string ContactPerson { get; set; }

    }
}