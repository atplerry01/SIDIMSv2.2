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
    [RoutePrefix("api/printing")]
    public class PrintingsController : ApiController
    {
        private ApplicationRepository _repo = null;
        readonly SidimBreezeRepository _repository = new SidimBreezeRepository();
        ApplicationDbContext context = new ApplicationDbContext();

        string userId;

        public PrintingsController()
        {
            _repo = new ApplicationRepository();
        }


        [Route("printCard/create")]
        public async Task<IHttpActionResult> CreatePrintCard(IList<FirstCardModel> entity)
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

            var newPrintCard = new Sid04Printing()
            {
                JobTrackerId = entity[0].JobTrackerId,
                InitializedById = userId,
                CompletedOn = DateTime.Now
            };

            context.Sid04Printings.Add(newPrintCard);
            await context.SaveChangesAsync();

            var jobTrackerId = entity[0].JobTrackerId;
            var jobTracker = await context.JobTrackers.Include(o => o.Job).FirstOrDefaultAsync(i => i.Id == jobTrackerId);

            var jobStatusCompleted = _repo.FindJobStatusByName("Completed");
            var jobStatusQueue = _repo.FindJobStatusByName("Queue");
            var jobStatusWIP = _repo.FindJobStatusByName("WIP");

            var job = await context.Jobs.FindAsync(jobTracker.JobId);
         
            var jobTypePersoOnly = _repo.FindJobTypeByName("Perso Only");
            var jobTypePrintingOnly = _repo.FindJobTypeByName("Printing Only");
            var jobTypePrintingAndPerso = _repo.FindJobTypeByName("Printing And Perso");
            var jobTypePrintingPersoAndMailing = _repo.FindJobTypeByName("Printing, Perso And Mailing");
            var jobTypePersoAndMailing = _repo.FindJobTypeByName("Perso And Mailing");
            var serviceType = job.ServiceTypeId;


            // Update JobTracker
            jobTracker.PrintingId = jobStatusWIP.Id;

            //// JobServiceType
            #region JobTrackerUpdateFlow

            if (serviceType == jobTypePrintingOnly.Id)
            {
                jobTracker.PrintQAId = jobStatusQueue.Id;
            }
            else if (serviceType == jobTypePrintingAndPerso.Id)
            {
                jobTracker.PrintQAId = jobStatusQueue.Id;
            }
            else if (serviceType == jobTypePrintingPersoAndMailing.Id)
            {
                jobTracker.PrintQAId = jobStatusQueue.Id;
            }

            #endregion

            jobTracker.ModifiedOn = DateTime.Now;
            context.Entry(jobTracker).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok<Sid04Printing>(newPrintCard);


        }

        [Route("PrintSplitCard/create")]
        public async Task<IHttpActionResult> CreateFirstCard(IList<FirstCardModel> entity)
        {
            userId = User.Identity.GetUserId();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var jobTracker = await context.JobTrackers.FindAsync(entity[0].JobTrackerId);
            var job = await context.Jobs.FindAsync(jobTracker.JobId);
            var serviceType = job.ServiceTypeId;

            // Create the JobSlip
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
                var lastJobSplit = _repository.JobSplits.OrderByDescending(x => x.Id).Take(1).ToList();

                // Create the QA Process
                var newQA = new Sid05QA()
                {
                    JobTrackerId = m.JobTrackerId,
                    JobSplitId = lastJobSplit[0].Id,
                    CreatedOn = DateTime.Now,
                    CreatedById = userId
                };
                var t11 = await CreateSidQA(newQA);
                
                // Create the CEAnalysis
                var goodQty = (m.RangeTo - m.RangeFrom) + 1;

                var newJobSlitCEAnalysis = new JobSplitPrintCEAnalysis()
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

                var t2 = await CreateJobPrintSplitCEAnalysis(newJobSlitCEAnalysis);
                
            }
            
            var jobStatusWIP = _repo.FindJobStatusByName("WIP");
            var jobStatusQueue = _repo.FindJobStatusByName("Queue");

            var jobTypePersoOnly = _repo.FindJobTypeByName("Perso Only");
            var jobTypePrintingOnly = _repo.FindJobTypeByName("Printing Only");
            var jobTypePrintingAndPerso = _repo.FindJobTypeByName("Printing And Perso");
            var jobTypePrintingPersoAndMailing = _repo.FindJobTypeByName("Printing, Perso And Mailing");
            var jobTypePersoAndMailing = _repo.FindJobTypeByName("Perso And Mailing");
          
            #region JobTrackerUpdateFlow

            if (serviceType == jobTypePrintingOnly.Id)
            {
                jobTracker.PrintQAId = jobStatusQueue.Id;
            }
            else if (serviceType == jobTypePrintingAndPerso.Id)
            {
                jobTracker.PrintQAId = jobStatusQueue.Id;
            }
            else if (serviceType == jobTypePrintingPersoAndMailing.Id)
            {
                jobTracker.PrintQAId = jobStatusQueue.Id;
            }

            #endregion

            jobTracker.ModifiedOn = DateTime.Now;
            jobTracker.PrintingId = jobStatusWIP.Id;
            context.Entry(jobTracker).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok();
        }

        [Route("printcomplete/create")]
        public async Task<IHttpActionResult> CreateFirstCard(Sid04Printing entity)
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

            var jobTracker = await context.JobTrackers.Include(o => o.Job).FirstOrDefaultAsync(i => i.Id == entity.JobTrackerId);

            var jobTypePrintingOnly = _repo.FindJobTypeByName("Printing Only");
            var jobTypePrintingAndPerso = _repo.FindJobTypeByName("Printing And Perso");
            var jobTypePrintingPersoAndMailing = _repo.FindJobTypeByName("Printing, Perso And Mailing");
            var serviceType = jobTracker.Job.ServiceTypeId;
            
            var newPrinting = new Sid04Printing()
            {
                JobTrackerId = entity.JobTrackerId,
                InitializedById = userId,
                CompletedOn = DateTime.Now
            };

            context.Sid04Printings.Add(newPrinting);
            await context.SaveChangesAsync();

            /// Update Tracker
            var jobStatusCompleted = _repo.FindJobStatusByName("Completed");
            var jobStatusQueue = _repo.FindJobStatusByName("Queue");

            jobTracker.PrintingId = jobStatusCompleted.Id;
            
            // JobServiceType
            #region JobTrackerUpdateFlow

            if (serviceType == jobTypePrintingOnly.Id)
            {
                jobTracker.QAId = jobStatusQueue.Id;
            }
            else if (serviceType == jobTypePrintingAndPerso.Id)
            {
                jobTracker.FirstJobRunId = jobStatusQueue.Id;
            }
            else if (serviceType == jobTypePrintingPersoAndMailing.Id)
            {
                jobTracker.FirstJobRunId = jobStatusQueue.Id;
            }
            #endregion

            jobTracker.ModifiedOn = DateTime.Now;
            context.Entry(jobTracker).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok<Sid04Printing>(newPrinting);
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

        [Route("jobslit-ce-analysis/create")]
        public async Task<IHttpActionResult> CreateJobPrintSplitCEAnalysis(JobSplitPrintCEAnalysis entity)
        {
            userId = User.Identity.GetUserId();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var newEntity = entity;

            context.JobSplitPrintCEAnalysis.Add(newEntity);
            await context.SaveChangesAsync();

            return Ok<JobSplitPrintCEAnalysis>(newEntity);
        }

        //[HttpPut]
        //[Route("jobslit-print-analysis/update/{id:int}")]
        //public async Task<IHttpActionResult> UpdateJobSlitCEAnalysis(int id, JobSplitPrintCEAnalysis entity)
        //{
        //    string userId = User.Identity.GetUserId();
        //    JobSplitPrintCEAnalysis existingEntity = await context.JobSplitPrintCEAnalysis.FindAsync(entity.Id);
        //    JobSplit jobSplit = await context.JobSplits.FindAsync(entity.JobSplitId);

        //    if (entity == null) { return NotFound(); }
        //    if (id != entity.Id) { return BadRequest(ModelState); }
        //    if (entity == null)
        //    {
        //        //return BadRequest(ModelState);
        //        var message = string.Format("Entry is empty");
        //        HttpError err = new HttpError(message);
        //        return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, err));

        //    }

        //    if (existingEntity != null && context.Entry(existingEntity).State != EntityState.Detached)
        //    {
        //        context.Entry(existingEntity).State = EntityState.Detached;
        //    }

        //    var local = context.Set<JobSplitPrintCEAnalysis>().Local.FirstOrDefault(f => f.Id == entity.Id);
        //    if (local != null) { context.Entry(local).State = EntityState.Detached; }

        //    // Analysis Computation
        //    var range = (jobSplit.RangeTo - jobSplit.RangeFrom) + 1;
        //    var quantityGood = range - (entity.QuantityBad + entity.QuantityHeld);

        //    entity.QuantityGood = quantityGood;
        //    entity.CreatedById = userId;
        //    entity.CreatedOn = DateTime.Now;

        //    context.JobSplitPrintCEAnalysis.Attach(entity);
        //    context.Entry(entity).State = EntityState.Modified;
        //    await context.SaveChangesAsync();

        //    return Ok<JobSplitPrintCEAnalysis>(entity);

        //}


        //[Route("jobslit-qc-analysis/create")]
        //public async Task<IHttpActionResult> CreateJobSlitQCAnalysis(JobSplitPrintQCAnalysis entity)
        //{
        //    userId = User.Identity.GetUserId();

        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    var newEntity = entity;

        //    context.JobSplitPrintQCAnalysis.Add(newEntity);
        //    await context.SaveChangesAsync();

        //    return Ok<JobSplitPrintQCAnalysis>(newEntity);
        //}

        [HttpPut]
        [Route("jobslit-print-qcanalysis/update/{id:int}")]
        public async Task<IHttpActionResult> UpdateJobSlitQCAnalysis(int id, JobSplitPrintCEAnalysis entity)
        {
            string userId = User.Identity.GetUserId();
            JobSplitPrintCEAnalysis existingEntity = await context.JobSplitPrintCEAnalysis.FindAsync(entity.Id);
            var jobSplit = await context.JobSplits.FindAsync(entity.JobSplitId);

            if (entity == null) { return NotFound(); }
            if (id != entity.Id) { return BadRequest(ModelState); }
            if (entity == null)
            {
                //return BadRequest(ModelState);
                var message = string.Format("Entry is empty");
                HttpError err = new HttpError(message);
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, err));

            }

            if (existingEntity != null && context.Entry(existingEntity).State != EntityState.Detached)
            {
                context.Entry(existingEntity).State = EntityState.Detached;
            }

            var local = context.Set<JobSplitPrintCEAnalysis>().Local.FirstOrDefault(f => f.Id == entity.Id);
            if (local != null) { context.Entry(local).State = EntityState.Detached; }

            // Analysis Computation
            var range = (jobSplit.RangeTo - jobSplit.RangeFrom) + 1;
            var quantityGood = range - (existingEntity.HeldReturned + (entity.QuantityBad + entity.QuantityHeld));

            existingEntity.QuantityGood = quantityGood;
            existingEntity.QuantityBad = entity.QuantityBad;
            existingEntity.QuantityHeld = entity.QuantityHeld;

            // Todo Audit fix
            existingEntity.CreatedById = userId;
            existingEntity.CreatedOn = DateTime.Now;
            existingEntity.ModifiedById = userId;
            existingEntity.ModifiedOn = DateTime.Now;

            existingEntity.IsCEInitialized = true;

            //Todo: inbuilt Tracker for QA, QC
            context.JobSplitPrintCEAnalysis.Attach(existingEntity);
            context.Entry(existingEntity).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok<JobSplitPrintCEAnalysis>(existingEntity);

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
        
    }
}
