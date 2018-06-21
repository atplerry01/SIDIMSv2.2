using AuthorizationServer.Api.Infrastructure;
using System.Web.Http;

namespace AuthorizationServer.Api.Controllers
{
    [RoutePrefix("api")]
    public class CustomersController : BaseApiController
    {
        ApplicationDbContext context = new ApplicationDbContext();

        //[Route("customers", Name = "GetCustomers")]
        //public IHttpActionResult GetAllClasses()
        //{
        //    return Ok(context.Customers);
        //}


    }
}
