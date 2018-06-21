using AuthorizationServer.Api.Infrastructure;
using AuthorizationServer.Api.Models;
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
    [RoutePrefix("api/relationship-manager")]
    public class RMController : ApiController
    {
        private readonly ApplicationRepository _repo = null;
        public readonly SidimBreezeRepository _repository = new SidimBreezeRepository();
        ApplicationDbContext context = new ApplicationDbContext();

        string userId;

        public RMController()
        {
            _repo = new ApplicationRepository();
            //_repository = new SidimBreezeRepository();
            //string userId = User.Identity.GetUserId();
        }

        [HttpPost]
        [Route("nonpersojob/create")]
        public async Task<IHttpActionResult> CreateNonPersoJob(NonPersoModel entity)
        {
            userId = User.Identity.GetUserId();
            
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            // Create the CS
            var newEntity = new NonPersoJob()
            {
                SidProductId = entity.SidProductId,
                Quantity = entity.Quantity,
                JobName = entity.JobName,
                Description = entity.Description,
                ServiceTypeId = entity.ServiceTypeId,
                IsTreated = false,

                CreatedById = userId,
                ModifiedById = userId,
                CreatedOn = DateTime.Now,
                ModifiedOn = DateTime.Now
            };

            context.NonPersoJobs.Add(newEntity);
            await context.SaveChangesAsync();

            return Ok<NonPersoJob>(newEntity);
        }

        [HttpPost]
        [Route("job/create")]
        public async Task<IHttpActionResult> CreateJob([FromBody] NonPersoModel entity) //Todo: Create the model for this entity
        {
            if (entity == null)
            {
                return BadRequest(ModelState);
            }

            // Get Required Resources
            var jobTypePrintingOnly = _repo.FindJobTypeByName("Printing Only");
            var jobTypeDispatchOnly = _repo.FindJobTypeByName("Dispatch Only");
           
            var jobName = _repo.FindServerJobByName(entity.JobName);
            var jobStatusPending = _repo.FindJobStatusByName("Pending");
            var jobStatusCompleted = _repo.FindJobStatusByName("Completed");
            var jobStatusQueue = _repo.FindJobStatusByName("Queue");
            var jobStatusNotRequired = _repo.FindJobStatusByName("Not Required");
         
            var newJob = new Job()
            {
                JobName = entity.JobName,
                SidCardTypeId = entity.SidProductId,
                SidClientId = entity.ClientId,
                ServiceTypeId = entity.ServiceTypeId,
                Quantity = entity.Quantity,
                CreatedOn = DateTime.Now
            };


            // Create Job
            //newJob.JobStatusId = jobStatusPending.Id;
            context.Jobs.Add(newJob);
            await context.SaveChangesAsync();

            var lastCreatedJob = _repository.Jobs.Where(m => m.JobName == entity.JobName).OrderByDescending(p => p.Id).ToList().FirstOrDefault();

            // JobTracker Setups
            #region JobTrackerSetup
            
           if (entity.ServiceTypeId == jobTypePrintingOnly.Id)
            {
                #region PrintOnly
                // Non Perso Job
                var jobTrackerPrintOnly = new JobTracker()
                {
                    JobId = lastCreatedJob.Id,
                    CardOpsId = jobStatusCompleted.Id,
                    InventoryId = jobStatusQueue.Id,
                    PrintingId = jobStatusQueue.Id,
                    CardEngrId = jobStatusNotRequired.Id,
                    QAId = jobStatusPending.Id,
                    FirstJobRunId = jobStatusNotRequired.Id,
                    CardEngrResumeId = jobStatusNotRequired.Id,
                    QCId = jobStatusPending.Id,
                    MailingId = jobStatusNotRequired.Id,
                    DispatchId = jobStatusPending.Id, //Create dispatch setups
                    MAudId = jobStatusPending.Id,
                    CustomerServiceId = jobStatusPending.Id,
                    TAT = 0
                };

                context.JobTrackers.Add(jobTrackerPrintOnly);
                await context.SaveChangesAsync();
                #endregion

            }
            else if (entity.ServiceTypeId == jobTypeDispatchOnly.Id)
            {
                #region DispatchOnly
                var jobTrackerMailingOnly = new JobTracker()
                {
                    JobId = lastCreatedJob.Id,
                    CardOpsId = jobStatusCompleted.Id,
                    InventoryId = jobStatusQueue.Id,
                    PrintingId = jobStatusNotRequired.Id,
                    CardEngrId = jobStatusNotRequired.Id,
                    QAId = jobStatusNotRequired.Id,
                    FirstJobRunId = jobStatusNotRequired.Id,
                    CardEngrResumeId = jobStatusNotRequired.Id,
                    QCId = jobStatusNotRequired.Id,
                    MailingId = jobStatusNotRequired.Id,
                    DispatchId = jobStatusQueue.Id, //Create dispatch setups
                    MAudId = jobStatusPending.Id,
                    CustomerServiceId = jobStatusPending.Id
                };

                context.JobTrackers.Add(jobTrackerMailingOnly);
                await context.SaveChangesAsync();
                #endregion

            }
          

            #endregion

            // CardOpsLogs
            //entity.Id = lastCreatedJob.Id;
            var t1 = CreateCardOpsLogs(newJob);
            await Task.WhenAll(t1);

            return Ok<Job>(newJob);

        }

        public async Task<IHttpActionResult> CreateCardOpsLogs(Job entity) //Todo: Create the model for this entity
        {
            string userId = User.Identity.GetUserId();

            var newEntity = new Sid01CardOps()
            {
                JobId = entity.Id,
                CreatedUserId = userId,
                CreatedOn = DateTime.Now
            };

            context.Sid01CardOps.Add(newEntity);
            await context.SaveChangesAsync();

            return Ok<Sid01CardOps>(newEntity);
        }



    }
}
