using AuthorizationServer.Api.Infrastructure;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace AuthorizationServer.Api.Controllers
{
    [Authorize]
    [RoutePrefix("api/sadmin")]
    public class SAdminController : ApiController
    {
        private ApplicationRepository _repo = null;
        readonly SidimBreezeRepository _repository = new SidimBreezeRepository();
        ApplicationDbContext context = new ApplicationDbContext();

        public SAdminController()
        {
            _repo = new ApplicationRepository();
            //string userId = User.Identity.GetUserId();
        }

        [Route("users")]
        public IHttpActionResult GetUserWithRoles()
        {
            var users = _repository.Users.Include("Roles");
            return Ok(users);
        }

    }
}
