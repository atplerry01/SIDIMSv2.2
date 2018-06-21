namespace SID.Common.Model.Lookups
{
    public class JobStatus
    {
        public int Id { get; set; }
        public string Name { get; set; }

        // { Pending, Queue, WIP, Flagged
        //   SLA Met, SLA Not Met, Completed
        //   Delivered, Not Delivered, Not Required }
    }
}
