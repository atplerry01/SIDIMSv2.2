namespace SID.Common.Model.Customer
{
    public class Order
    {
        public Order() {
            Prefix = "SCM";
        }
        public int Id { get; set; }
        public string Name { get; set; }
        public string Prefix { get; set; }

        public string Sequence
        {
            get
            {
                var seq = Prefix + "-" + Id.ToString();
                seq = seq.Replace(" ", "0");
                return seq;
            }
        }

    }
}