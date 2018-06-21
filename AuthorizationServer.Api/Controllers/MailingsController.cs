using AuthorizationServer.Api.Infrastructure;
using AuthorizationServer.Api.Models;
using Microsoft.AspNet.Identity;
using SID.Common.Model.Inventory;
using SID.Common.Model.Production;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace AuthorizationServer.Api.Controllers
{
    [Authorize]
    [RoutePrefix("api/mailing")]
    public class MailingsController : ApiController
    {
        private ApplicationRepository _repo = null;
        readonly SidimBreezeRepository _repository = new SidimBreezeRepository();
        ApplicationDbContext context = new ApplicationDbContext();
        string userId;

        public MailingsController()
        {
            _repo = new ApplicationRepository();
        }


        [Route("jobrun/create")]
        public async Task<IHttpActionResult> CreateQCJobRunClients(Sid07Mailing entity)
        {
            string userId = User.Identity.GetUserId();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var newEntity = new Sid07Mailing()
            {
                JobId = entity.JobId,
                MailingModeId = entity.MailingModeId,
                StartFrom = entity.StartFrom,
                EndPoint = entity.EndPoint,
                RunById = userId,
                RunDate = DateTime.Now
            };

            context.Sid07Mailings.Add(newEntity);
            await context.SaveChangesAsync();


            // Update JobTracker
            var jobStatusPending = _repo.FindJobStatusByName("Pending");
            var jobStatusCompleted = _repo.FindJobStatusByName("Completed");
            var jobStatusQueue = _repo.FindJobStatusByName("Queue");
            var jobStatusNotRequired = _repo.FindJobStatusByName("Not Required");

            var job = await context.Jobs.FindAsync(entity.JobId);
            var jobTrackerJobId = _repo.FindJobTrackerByJobId(entity.JobId);
            var jobTracker = await context.JobTrackers.FindAsync(jobTrackerJobId.Id);

            var jobTypeMailingOnly = _repo.FindJobTypeByName("Mailing Only");
            var jobTypePrintingPersoAndMailing = _repo.FindJobTypeByName("Printing, Perso And Mailing");
            var jobTypePersoAndMailing = _repo.FindJobTypeByName("Perso And Mailing");
            var serviceType = job.ServiceTypeId;

            jobTracker.MailingId = jobStatusCompleted.Id;

            // JobServiceType
            #region JobTrackerUpdateFlow

            if (serviceType == jobTypeMailingOnly.Id)
            {
                jobTracker.DispatchId = jobStatusQueue.Id;
            }
            else if (serviceType == jobTypePersoAndMailing.Id)
            {
                jobTracker.DispatchId = jobStatusQueue.Id;
            }
            else if (serviceType == jobTypePrintingPersoAndMailing.Id)
            {
                jobTracker.DispatchId = jobStatusQueue.Id;
            }

            #endregion

            jobTracker.ModifiedOn = DateTime.Now;
            context.Entry(jobTracker).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok<Sid07Mailing>(newEntity);
        }

        [Route("MailingSplitCard/create")]
        public async Task<IHttpActionResult> CreateFirstCard(IList<FirstCardModel> entity)
        {
            userId = User.Identity.GetUserId();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var jobTrackerId = entity[0].JobTrackerId;
            var jobTracker = await context.JobTrackers.FindAsync(jobTrackerId);
            var job = await context.Jobs.FindAsync(jobTracker.JobId);
            var department = _repo.FindDepartmentByName("Mailing");

            // Create the JobSplit
            foreach (var m in entity)
            {
                var newJobSlit = new JobSplit()
                {
                    JobTrackerId = m.JobTrackerId,
                    DepartmentId = department.Id,
                    SidMachineId = m.SidMachineId,
                    RangeFrom = m.RangeFrom,
                    RangeTo = m.RangeTo,
                    CreatedById = userId,
                    CreatedOn = DateTime.Now
                };

                // Create the item
                var t1 = await CreateJobSlit(newJobSlit);
            }


            ///
            var jobStatusWIP = _repo.FindJobStatusByName("WIP");
            var jobStatusQueue = _repo.FindJobStatusByName("Queue");

            var jobTypePersoOnly = _repo.FindJobTypeByName("Perso Only");
            var jobTypePrintingOnly = _repo.FindJobTypeByName("Printing Only");
            var jobTypeMailingOnly = _repo.FindJobTypeByName("Mailing Only");
            var jobTypePrintingAndPerso = _repo.FindJobTypeByName("Printing And Perso");
            var jobTypePrintingPersoAndMailing = _repo.FindJobTypeByName("Printing, Perso And Mailing");
            var jobTypePersoAndMailing = _repo.FindJobTypeByName("Perso And Mailing");

            var serviceType = job.ServiceTypeId;

            // Update JobTracker
            jobTracker.MailingId = jobStatusWIP.Id;

            //// JobServiceType
            #region JobTrackerUpdateFlow

            if (serviceType == jobTypeMailingOnly.Id)
            {
                jobTracker.DispatchId = jobStatusQueue.Id;
            }
            else if (serviceType == jobTypePersoAndMailing.Id)
            {
                jobTracker.DispatchId = jobStatusQueue.Id;
            }
            else if (serviceType == jobTypePrintingPersoAndMailing.Id)
            {
                jobTracker.DispatchId = jobStatusQueue.Id;
            }

            #endregion

            jobTracker.ModifiedOn = DateTime.Now;
            context.Entry(jobTracker).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok();
        }

        [Route("carddeliverylog/create")]
        public async Task<IHttpActionResult> CreateCardDeliveryLog(CardDeliveryLog entity)
        {
            userId = User.Identity.GetUserId();

            var department = _repo.FindDepartmentByName("Mailing");
            var cardDelivery = _repo.FindCardDeliveryByTrackerDepart(entity.JobTrackerId, department.Id);
            var jobTracker = await context.JobTrackers.FindAsync(entity.JobTrackerId);
            var cardIssuanceLog = _repo.FindCardIssuanceLogByJobTrackerId(entity.JobTrackerId);
            var jobSplitCEAnalysis = _repo.FindCEJobAnalysisTrackerId(entity.JobTrackerId);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var carddeliveryLog = new CardDeliveryLog()
            {
                JobTrackerId = entity.JobTrackerId,
                CardDeliveryId = cardDelivery.Id,
                RangeFrom = entity.RangeFrom,
                RangeTo = entity.RangeTo,
                BoxQty = entity.BoxQty,
                IsConfirmed = false,
                CreatedById = userId,
                CreatedOn = DateTime.Now,
                ConfirmedById = userId,
                ConfirmedOn = DateTime.Now
            };

            context.CardDeliveryLogs.Add(carddeliveryLog);
            await context.SaveChangesAsync();

            return Ok<CardDeliveryLog>(carddeliveryLog);
        }

        [Route("jobslit/create")]
        public async Task<IHttpActionResult> CreateJobSlit(JobSplit entity)
        {
            userId = User.Identity.GetUserId();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var newEntity = entity;

            context.JobSplits.Add(newEntity);
            await context.SaveChangesAsync();

            return Ok<JobSplit>(newEntity);
        }

        [Route("carddeliverylogconfirm/create")]
        public async Task<IHttpActionResult> CreateCardDeliveryLogConfirm(CardDeliveryLog entity)
        {
            var carddeliverylog = await context.CardDeliveryLogs.FindAsync(entity.Id);
            if (carddeliverylog == null) throw new ArgumentNullException(nameof(carddeliverylog));
            userId = User.Identity.GetUserId();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            carddeliverylog.ConfirmedById = userId;
            carddeliverylog.ConfirmedOn = DateTime.Now;
            carddeliverylog.IsConfirmed = true;
            var t0 = await UpdateCardDeliveryLog(carddeliverylog.Id, carddeliverylog);
            
            return Ok();
        }

        [HttpPost]
        [Route("carddeliverylog/delete")]
        public async Task<IHttpActionResult> DeleteCardDeliveryLog(CardDeliveryLog entity)
        {
            var carddeliverylog = await context.CardDeliveryLogs.FindAsync(entity.Id);
            if (carddeliverylog == null) throw new ArgumentNullException(nameof(carddeliverylog));
            userId = User.Identity.GetUserId();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            carddeliverylog.IsDeleted = true;

            var t0 = await UpdateCardDeliveryLog(carddeliverylog.Id, carddeliverylog);

            return Ok();
        }
        
        [HttpPut]
        [Route("carddeliverylog/update/{id:int}")]
        public async Task<IHttpActionResult> UpdateCardDeliveryLog(int id, CardDeliveryLog entity)
        {
            var existingEntity = await context.CardDeliveryLogs.FindAsync(entity.Id);

            if (id != entity.Id) { return BadRequest(ModelState); }
            if (existingEntity != null && context.Entry(existingEntity).State != EntityState.Detached)
            {
                context.Entry(existingEntity).State = EntityState.Detached;
            }

            context.CardDeliveryLogs.Attach(entity);
            context.Entry(entity).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok<CardDeliveryLog>(entity);

        }
        
    }
}
