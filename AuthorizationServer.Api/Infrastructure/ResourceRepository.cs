using System;

namespace AuthorizationServer.Api.Infrastructure
{
    public class ResourceRepository : IDisposable
    {
        private ApplicationDbContext _ctx;
        
        //public async Task<Customer> FindCustomerById(int entityId)
        //{
        //    var entity = await _ctx.Customers.FindAsync(entityId);
        //    return entity;
        //}

        //public Customer FindCustomerByName(string name)
        //{
        //    var entity = _ctx.Customers.Where(a => a.Name == name).SingleOrDefault();
        //    return entity;
        //}



        public void Dispose()
        {
            _ctx.Dispose();

        }

    }
}