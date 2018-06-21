using AuthorizationServer.Api.Infrastructure;
using AuthorizationServer.Api.Models;
using Microsoft.AspNet.Identity;
using SID.Common.Model.Inventory;
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
    [Authorize(Roles = "CardEngr")]
    [RoutePrefix("api/ce")]
    public class CardEngineersController : ApiController
    {
        private ApplicationRepository _repo = null;
        readonly SidimBreezeRepository _repository = new SidimBreezeRepository();
        ApplicationDbContext context = new ApplicationDbContext();

        string userId;

        public CardEngineersController()
        {
            _repo = new ApplicationRepository();
        }

        [Route("firstcard/create")]
        public async Task<IHttpActionResult> CreateFirstCard(IList<FirstCardModel> entity)
        {
            if (entity == null) throw new ArgumentNullException(nameof(entity));
            userId = User.Identity.GetUserId();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var jobTypePersoOnly = _repo.FindJobTypeByName("Perso Only");
            var jobTypePrintingOnly = _repo.FindJobTypeByName("Printing Only");
            var jobTypeMailingOnly = _repo.FindJobTypeByName("Mailing Only");
            var jobTypePrintingAndPerso = _repo.FindJobTypeByName("Printing And Perso");
            var jobTypePrintingPersoAndMailing = _repo.FindJobTypeByName("Printing, Perso And Mailing");
            var jobTypePersoAndMailing = _repo.FindJobTypeByName("Perso And Mailing");

            var departmentCE = _repo.FindDepartmentByName("Card Engineer");
            var departmentQc = _repo.FindDepartmentByName("Quality Control");
            var departmentMa = _repo.FindDepartmentByName("Mailing");
            var departmentDp = _repo.FindDepartmentByName("Dispatch");
            
            var jobStatusCompleted = _repo.FindJobStatusByName("Completed");
            var jobStatusQueue = _repo.FindJobStatusByName("Queue");

            var jobTracker = await context.JobTrackers.FindAsync(entity[0].JobTrackerId);
            var job = await context.Jobs.FindAsync(jobTracker.JobId);
            var serviceType = job.ServiceTypeId;
            
            var newFirstCard = new Sid03FirstCard()
            {
                JobTrackerId = entity[0].JobTrackerId,
                InitializedById = userId,
                InitializedOn = DateTime.Now
            };

            context.Sid03FirstCards.Add(newFirstCard);
            await context.SaveChangesAsync();
            
            // Create the JobSplit
            #region JobSplitAnalysis

            foreach (var m in entity)
            {
                var newJobSlit = new JobSplit()
                {
                    JobTrackerId = m.JobTrackerId,
                    DepartmentId = m.DepartmentId,
                    SidMachineId = m.SidMachineId,
                    RangeFrom = m.RangeFrom,
                    RangeTo = m.RangeTo,
                    CreatedById = userId,
                    CreatedOn = DateTime.Now
                };

                var t1 = await CreateJobSlit(newJobSlit);

                var lastTestMe = newJobSlit.Id;
                var lastJobSplit = _repository.JobSplits.OrderByDescending(x => x.Id).Take(1).ToList();

                // Create the QA Process
                var newQA = new Sid05QA()
                {
                    JobTrackerId = m.JobTrackerId,
                    JobSplitId = lastJobSplit[0].Id,
                    CreatedOn = DateTime.Now,
                    CreatedById = userId
                };
                var t2 = await CreateSidQA(newQA);

                // Create the CEAnalysis
                var goodQty = (m.RangeTo - m.RangeFrom) + 1;
                var newJobSlitCEAnalysis = new JobSplitCEAnalysis()
                {
                    JobSplitId = lastJobSplit[0].Id,
                    JobTrackerId = m.JobTrackerId,
                    QuantityGood = goodQty,
                    QuantityBad = 0,
                    QuantityHeld = 0,
                    CreatedOn = DateTime.Now,
                    CreatedById = userId,
                    ModifiedById = userId,
                    ModifiedOn = DateTime.Now
                };

                var t3 = await CreateJobSlitCEAnalysis(newJobSlitCEAnalysis);
                
            }

            #endregion

            //// Update JobTracker
            #region JobTrackerUpdateFlow

            jobTracker.FirstJobRunId = jobStatusCompleted.Id;

            if (serviceType == jobTypePersoOnly.Id)
            {
                jobTracker.QAId = jobStatusQueue.Id;
            }
            else if (serviceType == jobTypePrintingAndPerso.Id)
            {
                jobTracker.QAId = jobStatusQueue.Id;
            }
            else if (serviceType == jobTypePersoAndMailing.Id)
            {
                jobTracker.QAId = jobStatusQueue.Id;
            }
            else if (serviceType == jobTypePrintingPersoAndMailing.Id)
            {
                jobTracker.QAId = jobStatusQueue.Id;
            }

            jobTracker.ModifiedOn = DateTime.Now;
            context.Entry(jobTracker).State = EntityState.Modified;
            await context.SaveChangesAsync();

            #endregion

            return Ok<Sid03FirstCard>(newFirstCard);
        }
        
        [Route("resumenewjob/create")]
        public async Task<IHttpActionResult> CreateResumeNewJob(Sid03CardEngr entity)
        {
            userId = User.Identity.GetUserId();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Update the JobTracker
            var jobStatusPending = _repo.FindJobStatusByName("Pending");
            var jobStatusCompleted = _repo.FindJobStatusByName("Completed");
            var jobStatusQueue = _repo.FindJobStatusByName("Queue");
            var jobStatusNotRequired = _repo.FindJobStatusByName("Not Required");

            var job = await context.Jobs.FindAsync(entity.JobId);
            var jobTrackerJobId = _repo.FindJobTrackerByJobId(entity.JobId);
            var jobTracker = await context.JobTrackers.FindAsync(jobTrackerJobId.Id);

            var jobTypePersoOnly = _repo.FindJobTypeByName("Perso Only");
            var jobTypePrintingOnly = _repo.FindJobTypeByName("Printing Only");
            var jobTypePrintingAndPerso = _repo.FindJobTypeByName("Printing And Perso");
            var jobTypePrintingPersoAndMailing = _repo.FindJobTypeByName("Printing, Perso And Mailing");
            var jobTypePersoAndMailing = _repo.FindJobTypeByName("Perso And Mailing");

            var serviceType = job.ServiceTypeId;


            jobTracker.CardEngrResumeId = jobStatusCompleted.Id;

            // JobServiceType
            #region JobTrackerUpdateFlow

            if (serviceType == jobTypePersoOnly.Id)
            {
                jobTracker.QCId = jobStatusQueue.Id;
            }
            else if (serviceType == jobTypePrintingAndPerso.Id)
            {
                jobTracker.QCId = jobStatusQueue.Id;
            }
            else if (serviceType == jobTypePersoAndMailing.Id)
            {
                jobTracker.QCId = jobStatusQueue.Id;
            }
            else if (serviceType == jobTypePrintingPersoAndMailing.Id)
            {
                jobTracker.QCId = jobStatusQueue.Id;
            }

            #endregion

            jobTracker.ModifiedOn = DateTime.Now;
            context.Entry(jobTracker).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok();
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

        
        [Route("carddelivery/create")]
        public async Task<IHttpActionResult> CreateCardDelivery(CardDelivery entity)
        {
            userId = User.Identity.GetUserId();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var newEntity = entity;

            context.CardDelivery.Add(newEntity);
            await context.SaveChangesAsync();

            return Ok<CardDelivery>(newEntity);
        }

        [Route("carddeliverylog/create")]
        public async Task<IHttpActionResult> CreateCardDeliveryLog(CardDeliveryLog entity)
        {
            userId = User.Identity.GetUserId();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var department = _repo.FindDepartmentByName("Card Engineer");
            var cardDelivery = _repo.FindCardDeliveryByTrackerDepart(entity.JobTrackerId, department.Id);
            
            var carddeliveryLog = new CardDeliveryLog()
            {
                JobTrackerId = entity.JobTrackerId,
                CardDeliveryId = cardDelivery.Id,
                RangeFrom = entity.RangeFrom,
                RangeTo = entity.RangeTo,
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

        [Route("SidQA/create")]
        public async Task<IHttpActionResult> CreateSidQA(Sid05QA entity)
        {
            userId = User.Identity.GetUserId();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var newEntity = entity;

            context.Sid05QAs.Add(newEntity);
            await context.SaveChangesAsync();

            return Ok<Sid05QA>(newEntity);
        }


        [Route("jobslit-ce-analysis/create")]
        public async Task<IHttpActionResult> CreateJobSlitCEAnalysis(JobSplitCEAnalysis entity)
        {
            userId = User.Identity.GetUserId();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var newEntity = entity;

            context.JobSplitCEAnalysis.Add(newEntity);
            await context.SaveChangesAsync();

            return Ok<JobSplitCEAnalysis>(newEntity);
        }

     
        [HttpPut]
        [Route("jobslit-ce-analysis/update/{id:int}")]
        public async Task<IHttpActionResult> UpdateJobSlitCEAnalysis(int id, JobSplitCEAnalysis entity)
        {
            
            string userId = User.Identity.GetUserId();
            var copiedEntity = entity;

            JobSplitCEAnalysis existingEntity = await context.JobSplitCEAnalysis.FindAsync(entity.Id);
            var jobSplit = await context.JobSplits.Include(a => a.JobTracker).FirstOrDefaultAsync(b => b.Id == entity.JobSplitId);

            if (entity == null) { return NotFound(); }
            if (id != entity.Id) { return BadRequest(ModelState); }
            if (entity == null)
            {
                var message = string.Format("Entry is empty");
                HttpError err = new HttpError(message);
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, err));

            }

            if (existingEntity != null && context.Entry(existingEntity).State != EntityState.Detached)
            {
                context.Entry(existingEntity).State = EntityState.Detached;
            }

            var local = context.Set<JobSplitCEAnalysis>().Local.FirstOrDefault(f => f.Id == entity.Id);
            if (local != null) { context.Entry(local).State = EntityState.Detached; }

            // Analysis Computation
            var range = (jobSplit.RangeTo - jobSplit.RangeFrom) + 1;
            var quantityGood = range - (existingEntity.HeldReturned + (entity.QuantityBad + entity.QuantityHeld));

            existingEntity.QuantityGood = quantityGood;
            existingEntity.QuantityBad = entity.QuantityBad;
            existingEntity.QuantityHeld = entity.QuantityHeld;

            existingEntity.ModifiedById = userId;
            existingEntity.ModifiedOn = DateTime.Now;
            existingEntity.IsCEInitialized = true;

            context.JobSplitCEAnalysis.Attach(existingEntity);
            context.Entry(existingEntity).State = EntityState.Modified;
            await context.SaveChangesAsync();

            // Update the JobTracker
            var jobStatusWIP = _repo.FindJobStatusByName("WIP");
            var jobStatusPending = _repo.FindJobStatusByName("Pending");
            var jobStatusCompleted = _repo.FindJobStatusByName("Completed");
            var jobStatusQueue = _repo.FindJobStatusByName("Queue");
            var jobStatusNotRequired = _repo.FindJobStatusByName("Not Required");

            var job = await context.Jobs.FindAsync(jobSplit.JobTracker.JobId);
            var jobTracker = await context.JobTrackers.FindAsync(jobSplit.JobTracker.Id);

            var jobTypePersoOnly = _repo.FindJobTypeByName("Perso Only");
            var jobTypePrintingOnly = _repo.FindJobTypeByName("Printing Only");
            var jobTypePrintingAndPerso = _repo.FindJobTypeByName("Printing And Perso");
            var jobTypePrintingPersoAndMailing = _repo.FindJobTypeByName("Printing, Perso And Mailing");
            var jobTypePersoAndMailing = _repo.FindJobTypeByName("Perso And Mailing");

            var serviceType = job.ServiceTypeId;
            
            jobTracker.CardEngrResumeId = jobStatusWIP.Id;

            if (copiedEntity.IsCEInitialized == false)
            {
               

            }

            // JobServiceType Tracker Update
            #region JobTrackerUpdateFlow

            if (serviceType == jobTypePersoOnly.Id)
            {
                jobTracker.QCId = jobStatusQueue.Id;
            }
            else if (serviceType == jobTypePrintingAndPerso.Id)
            {
                jobTracker.QCId = jobStatusQueue.Id;
            }
            else if (serviceType == jobTypePersoAndMailing.Id)
            {
                jobTracker.QCId = jobStatusQueue.Id;
            }
            else if (serviceType == jobTypePrintingPersoAndMailing.Id)
            {
                jobTracker.QCId = jobStatusQueue.Id;
            }

            #endregion

            jobTracker.ModifiedOn = DateTime.Now;
            context.Entry(jobTracker).State = EntityState.Modified;
            await context.SaveChangesAsync();
            return Ok<JobSplitCEAnalysis>(entity);

        }

        [Route("jobhandler/create")]
        public async Task<IHttpActionResult> CreateJobHandler(JobHandler entity)
        {
            userId = User.Identity.GetUserId();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Validate the 
            var existingJobHandler = _repo.FindJobHandler(entity.JobTrackerId, entity.JobSplitId, userId, entity.Remark);

            if (existingJobHandler != null)
            {
                var jobStatusWIP = _repo.FindJobStatusByName("WIP");
                var jobStatusQueue = _repo.FindJobStatusByName("Queue");

                var jobTracker = await context.JobTrackers.FindAsync(entity.JobTrackerId);

                jobTracker.CardEngrResumeId = jobStatusWIP.Id;
                jobTracker.QCId = jobStatusQueue.Id;
                context.Entry(jobTracker).State = EntityState.Modified;
                await context.SaveChangesAsync();


                var message = string.Format("Issuance exceed Job Quantity");
                var err = new HttpError(message);
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, err));

            }

            var newEntity = entity;

            context.JobHandlers.Add(newEntity);
            await context.SaveChangesAsync();

            return Ok<JobHandler>(newEntity);
        }

        [HttpPut]
        [Route("jobhandle/update/{id:int}")]
        public async Task<IHttpActionResult> UpdateJobHandleCEAnalysis(int id, JobSplitCEAnalysis entity)
        {

            string userId = User.Identity.GetUserId();

            var existingEntity = await context.JobSplitCEAnalysis.FindAsync(entity.Id);

            if (entity == null) { return NotFound(); }
            if (id != entity.Id) { return BadRequest(ModelState); }
            if (entity == null)
            {
                var message = string.Format("Entry is empty");
                HttpError err = new HttpError(message);
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, err));
            }

            if (existingEntity != null && context.Entry(existingEntity).State != EntityState.Detached)
            {
                context.Entry(existingEntity).State = EntityState.Detached;
            }

            var local = context.Set<JobSplitCEAnalysis>().Local.FirstOrDefault(f => f.Id == entity.Id);
            if (local != null) { context.Entry(local).State = EntityState.Detached; }

            existingEntity.IsJobHandleByCE = true;
            

            context.Entry(existingEntity).State = EntityState.Modified;
            await context.SaveChangesAsync();


            var jobHandler = new JobHandler()
            {
                JobTrackerId = existingEntity.JobTrackerId,
                JobSplitId = existingEntity.JobSplitId,
                HandlerId = userId,
                CreatedOn = DateTime.Now,
                ModifiedOn = DateTime.Now,
                Remark = "CE"
            };

            //Create JobHandle
            var tx = CreateJobHandler(jobHandler);

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
