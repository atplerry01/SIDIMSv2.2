using SID.Common.Model.Customer;
using System.Data.Entity.ModelConfiguration;

namespace AuthorizationServer.Api.Infrastructure.Configuration
{
   
    public class OrderConfiguration : EntityTypeConfiguration<Order>
    {
        public OrderConfiguration()
        {
            
        }
    }

}