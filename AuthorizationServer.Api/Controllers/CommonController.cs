using AuthorizationServer.Api.Infrastructure;
using Microsoft.AspNet.Identity;
using SID.Common.Model.Production;
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
    [RoutePrefix("api/common")]
    public class CommonController : ApiController
    {
        private readonly ApplicationRepository _repo = null;
        public readonly SidimBreezeRepository _repository = new SidimBreezeRepository();
        ApplicationDbContext context = new ApplicationDbContext();

        string _userId;

        public CommonController()
        {
            _repo = new ApplicationRepository();
        }

        [Route("flagjob/create")]
        public async Task<IHttpActionResult> CreateJobFlag(JobFlag entity)
        {
            _userId = User.Identity.GetUserId();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // UPdate Tracker
            var jobTracker = await context.JobTrackers.FindAsync(entity.JobTrackerId);

            var updateJobTracker = jobTracker;
            updateJobTracker.IsFlag = true;
            var t0UpdateJobTracker = await UpdateJobTracker(updateJobTracker.Id, updateJobTracker);

            // Create JobFlag
            entity.CreatedById = _userId;
            entity.CreatedOn = DateTime.Now;
            entity.ModifiedById = _userId;
            entity.ModifiedOn = DateTime.Now;
            entity.ResolvedById = _userId;

            context.JobFlags.Add(entity);
            await context.SaveChangesAsync();
            
            return Ok<JobFlag>(entity);
        }
        
        public async Task<IHttpActionResult> UpdateJobTracker(int id, JobTracker entity)
        {
            var existingEntity = await context.JobTrackers.FindAsync(entity.Id);
            if (id != entity.Id) { return BadRequest(ModelState); }

            if (existingEntity != null && context.Entry(existingEntity).State != EntityState.Detached)
            {
                context.Entry(existingEntity).State = EntityState.Detached;
            }

            var local = context.Set<JobTracker>().Local.FirstOrDefault(f => f.Id == entity.Id);
            if (local != null) { context.Entry(local).State = EntityState.Detached; }

            context.JobTrackers.Attach(entity);
            context.Entry(entity).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok<JobTracker>(entity);

        }


    }
}
