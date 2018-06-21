using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SID.Common.Model.Infrastructure
{
    public class AccountLogin
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public int DefaultAccount { get; set; }

    }
}