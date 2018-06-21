namespace SID.Common.Model.Lookups
{
    public class Status
    {
        public int Id { get; set; }
        public string Name { get; set; }
        // { Pending, Work In Progress, 
        //   Not Required, Completed
        //   OnHold, Resume, Kill }
    }
}