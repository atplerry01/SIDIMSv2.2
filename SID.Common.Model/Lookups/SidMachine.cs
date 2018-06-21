using System.ComponentModel.DataAnnotations.Schema;

namespace SID.Common.Model.Lookups
{
    public class SidMachine
    {
        public int Id { get; set; }
        public int DepartmentId { get; set; }
        public string Name { get; set; }

        [ForeignKey("DepartmentId")]
        public virtual Department Department { get; set; }
        
    }

}