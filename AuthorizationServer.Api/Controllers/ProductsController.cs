using AuthorizationServer.Api.Infrastructure;
using SID.Common.Model.Lookups;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace AuthorizationServer.Api.Controllers
{
    [Authorize]
    [RoutePrefix("api/products")]
    public class ProductsController : ApiController
    {
        ApplicationDbContext context = new ApplicationDbContext();

        public ProductsController()
        {

        }

        [HttpPost]
        [Route("delete")]
        public async Task<IHttpActionResult> DeleteProduct(SidProduct entity)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var product = await context.SidProducts.FindAsync(entity.Id);
            product.IsDeleted = true;

            context.SidProducts.Attach(product);
            context.Entry(product).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok();
        }



    }
}
