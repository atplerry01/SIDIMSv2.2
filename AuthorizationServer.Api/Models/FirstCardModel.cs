namespace AuthorizationServer.Api.Models
{
    public class FirstCardModel
    {
        public int JobTrackerId { get; set; }
        public int DepartmentId { get; set; }
        public int SidMachineId { get; set; }
        public int RangeFrom { get; set; }
        public int RangeTo { get; set; }

        //public int JobBatchTrackerId { get; set; }
    }
}