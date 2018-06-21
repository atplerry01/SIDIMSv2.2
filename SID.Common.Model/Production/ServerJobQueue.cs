using SID.Common.Model.Contract;
using System;

namespace SID.Common.Model.Production
{
    public class ServerJobQueue : IAuditInfo
    {
        public ServerJobQueue()
        {
            IsTreated = false;
            IsDeleted = false;
        }

        public int Id { get; set; }
        public string JobName { get; set; }
        public bool IsTreated { get; set; }
        public bool IsDeleted { get; set; }

        // Audit Section
        public DateTime CreatedOn { get; set; }
        public DateTime ModifiedOn { get; set; }

    }
}