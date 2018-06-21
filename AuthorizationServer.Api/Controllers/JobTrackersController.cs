using AuthorizationServer.Api.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace AuthorizationServer.Api.Controllers
{
    [RoutePrefix("api/jobtrackers")]
    public class JobTrackersController : ApiController
    {
        ApplicationDbContext context = new ApplicationDbContext();

        public JobTrackersController()
        {

        }

        [Route("")]
        public async Task<IHttpActionResult> GetJobTrackers()
        {
            var jobTrackers = context.JobTrackers.Where(a => a.IsCompleted == false && a.IsFlag == false && a.IsDeleted == false).ToList();
            return Ok(jobTrackers);
        }


    }
}
