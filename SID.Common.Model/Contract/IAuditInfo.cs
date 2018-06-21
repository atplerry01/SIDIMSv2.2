using System;

namespace SID.Common.Model.Contract
{
    public interface IAuditInfo
    {
        DateTime CreatedOn { get; set; }
        DateTime ModifiedOn { get; set; }
    }
}
