using AuthorizationServer.Api.Infrastructure;
using AuthorizationServer.Api.Models;
using Microsoft.AspNet.Identity;
using SID.Common.Model.Production;
using System;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace AuthorizationServer.Api.Controllers
{
    [Authorize]
    [RoutePrefix("api/qac")]
    public class QACController : ApiController
    {
        private ApplicationRepository _repo = null;
        readonly SidimBreezeRepository _repository = new SidimBreezeRepository();
        ApplicationDbContext context = new ApplicationDbContext();

        string userId;

        public QACController()
        {
            _repo = new ApplicationRepository();
        }

        
        [Route("jobcheck/create")]
        public async Task<IHttpActionResult> CreateClients(Sid05QA entity)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            context.Sid05QAs.Add(entity);
            await context.SaveChangesAsync();

            // Update JobTracker
            var jobStatusPending = _repo.FindJobStatusByName("Pending");
            var jobStatusCompleted = _repo.FindJobStatusByName("Completed");
            var jobStatusQueue = _repo.FindJobStatusByName("Queue");
            var jobStatusNotRequired = _repo.FindJobStatusByName("Not Required");
            
            JobTracker jobTracker = await context.JobTrackers.FindAsync(entity.JobTrackerId);
            Job job = await context.Jobs.FindAsync(jobTracker.JobId);

            var jobTypePersoOnly = _repo.FindJobTypeByName("Perso Only");
            var jobTypePrintingOnly = _repo.FindJobTypeByName("Printing Only");
            var jobTypePrintingAndPerso = _repo.FindJobTypeByName("Printing And Perso");
            var jobTypePrintingPersoAndMailing = _repo.FindJobTypeByName("Printing, Perso And Mailing");
            var jobTypePersoAndMailing = _repo.FindJobTypeByName("Perso And Mailing");
            var serviceType = job.ServiceTypeId;

            // Update JobTracker
            jobTracker.QAId = jobStatusCompleted.Id;

            // JobServiceType
            #region JobTrackerUpdateFlow

            if (serviceType == jobTypePrintingOnly.Id)
            {
                jobTracker.QCId = jobStatusQueue.Id;
            }
            else if (serviceType == jobTypePersoOnly.Id)
            {
                jobTracker.CardEngrResumeId = jobStatusQueue.Id;
            }
            else if (serviceType == jobTypePrintingAndPerso.Id)
            {
                jobTracker.CardEngrResumeId = jobStatusQueue.Id;
            }
            else if (serviceType == jobTypePersoAndMailing.Id)
            {
                jobTracker.CardEngrResumeId = jobStatusQueue.Id;
            }
            else if (serviceType == jobTypePrintingPersoAndMailing.Id)
            {
                jobTracker.CardEngrResumeId = jobStatusQueue.Id;
            }

            #endregion

            jobTracker.ModifiedOn = DateTime.Now;
            context.Entry(jobTracker).State = EntityState.Modified;
            await context.SaveChangesAsync();
            
            return Ok<Sid05QA>(entity);
        }

        [Route("jobcheckprocess/create")]
        public async Task<IHttpActionResult> QACheckProcess(Sid05QA entity)
        {
            string userId = User.Identity.GetUserId();
            JobSplit jobSplit = await context.JobSplits.FindAsync(entity.JobSplitId);
            
            JobTracker jobTracker = await context.JobTrackers.FindAsync(entity.JobTrackerId);
            Job job = await context.Jobs.FindAsync(jobTracker.JobId);
            
            var jobStatusPending = _repo.FindJobStatusByName("Pending");
            var jobStatusCompleted = _repo.FindJobStatusByName("Completed");
            var jobStatusQueue = _repo.FindJobStatusByName("Queue");
            var jobStatusNotRequired = _repo.FindJobStatusByName("Not Required");

            var jobTypePersoOnly = _repo.FindJobTypeByName("Perso Only");
            var jobTypePrintingOnly = _repo.FindJobTypeByName("Printing Only");
            var jobTypePrintingAndPerso = _repo.FindJobTypeByName("Printing And Perso");
            var jobTypePrintingPersoAndMailing = _repo.FindJobTypeByName("Printing, Perso And Mailing");
            var jobTypePersoAndMailing = _repo.FindJobTypeByName("Perso And Mailing");
            var serviceType = job.ServiceTypeId;

            var printDepartment = _repo.FindDepartmentByName("Printing");
            var persoDepartment = _repo.FindDepartmentByName("Card Engineer");


            // Update Selected Split QA Process
            var t1 = await UpdateQAJobChecks(entity.Id, entity);
            
            // JobSplit Process
            jobSplit.IsQACompleted = true;
            var t2 = await UpdateJobSplit(jobSplit.Id, jobSplit);

            // If The split category id Printing
            if (jobSplit.DepartmentId == printDepartment.Id)
            {
                // Process Print Stage Scenerio
                var printDepart = _repo.FindPersoJobSplitByQAProcess(jobSplit.JobTrackerId, printDepartment.Id);

                if (printDepart == null) // If there is no item to process
                {
                    jobTracker.PrintQAId = jobStatusCompleted.Id;
                    jobTracker.PrintQCId = jobStatusQueue.Id;
                    jobTracker.ModifiedOn = DateTime.Now;

                    context.Entry(jobTracker).State = EntityState.Modified;
                    await context.SaveChangesAsync();
                }

            }
            else
            {
                // Process Perso Scenerio
                var PersoChecker = _repo.FindPersoJobSplitByQAProcess(jobSplit.JobTrackerId, persoDepartment.Id);

                if (PersoChecker == null)
                {
                    // Update the Tracker
                    #region UpdateTracker

                    // Update JobTracker
                    jobTracker.QAId = jobStatusCompleted.Id;

                    // JobServiceType
                    #region JobTrackerUpdateFlow

                    if (serviceType == jobTypePrintingOnly.Id)
                    {
                        jobTracker.QCId = jobStatusQueue.Id;
                    }
                    else if (serviceType == jobTypePersoOnly.Id)
                    {
                        jobTracker.CardEngrResumeId = jobStatusQueue.Id;
                    }
                    else if (serviceType == jobTypePrintingAndPerso.Id)
                    {
                        jobTracker.CardEngrResumeId = jobStatusQueue.Id;
                    }
                    else if (serviceType == jobTypePersoAndMailing.Id)
                    {
                        jobTracker.CardEngrResumeId = jobStatusQueue.Id;
                    }
                    else if (serviceType == jobTypePrintingPersoAndMailing.Id)
                    {
                        jobTracker.CardEngrResumeId = jobStatusQueue.Id;
                    }

                    #endregion

                    jobTracker.ModifiedOn = DateTime.Now;
                    context.Entry(jobTracker).State = EntityState.Modified;
                    await context.SaveChangesAsync();

                    #endregion
                }


            }
            
            return Ok<Sid05QA>(entity);

        }
        
        [HttpPut]
        [Route("jobcheck/update/{id:int}")]
        public async Task<IHttpActionResult> UpdateQAJobChecks(int id, Sid05QA entity)
        {
            string userId = User.Identity.GetUserId();
            Sid05QA existingEntity = await context.Sid05QAs.FindAsync(entity.Id);

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

            var local = context.Set<Sid05QA>().Local.FirstOrDefault(f => f.Id == entity.Id);
            if (local != null) { context.Entry(local).State = EntityState.Detached; }

            entity.CreatedOn = DateTime.Now;
            entity.CreatedById = userId;

            context.Sid05QAs.Attach(entity);
            context.Entry(entity).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok<Sid05QA>(entity);

        }
        
        [Route("jobrun/create")]
        public async Task<IHttpActionResult> CreateQCJobRunClients(Sid06QC entity)
        {
            string userId = User.Identity.GetUserId();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var newEntity = new Sid06QC()
            {
                JobTrackerId = entity.JobTrackerId,
                StartFrom = entity.StartFrom,
                EndPoint = entity.EndPoint,
                RunById = userId,
                RunDate = DateTime.Now
            };

            context.Sid06QCs.Add(newEntity);
            await context.SaveChangesAsync();

            var jobStatusPending = _repo.FindJobStatusByName("Pending");
            var jobStatusCompleted = _repo.FindJobStatusByName("Completed");
            var jobStatusQueue = _repo.FindJobStatusByName("Queue");
            var jobStatusNotRequired = _repo.FindJobStatusByName("Not Required");

            var jobTracker = await context.JobTrackers.FindAsync(entity.JobTrackerId);
            var job = await context.Jobs.FindAsync(jobTracker.JobId);
         
            var jobTypePersoOnly = _repo.FindJobTypeByName("Perso Only");
            var jobTypePrintingOnly = _repo.FindJobTypeByName("Printing Only");
            var jobTypePrintingAndPerso = _repo.FindJobTypeByName("Printing And Perso");
            var jobTypePrintingPersoAndMailing = _repo.FindJobTypeByName("Printing, Perso And Mailing");
            var jobTypePersoAndMailing = _repo.FindJobTypeByName("Perso And Mailing");
            var serviceType = job.ServiceTypeId;

            // Update JobTracker
            jobTracker.QCId = jobStatusCompleted.Id;
            
            // JobServiceType
            #region JobTrackerUpdateFlow

            if (serviceType == jobTypePrintingOnly.Id)
            {
                jobTracker.DispatchId = jobStatusQueue.Id;
            }
            else if (serviceType == jobTypePersoOnly.Id)
            {
                jobTracker.DispatchId = jobStatusQueue.Id;
            }
            else if (serviceType == jobTypePrintingAndPerso.Id)
            {
                jobTracker.DispatchId = jobStatusQueue.Id;
            }
            else if (serviceType == jobTypePersoAndMailing.Id)
            {
                jobTracker.MailingId = jobStatusQueue.Id;
            }
            else if (serviceType == jobTypePrintingPersoAndMailing.Id)
            {
                jobTracker.MailingId = jobStatusQueue.Id;
            }

            #endregion

            jobTracker.ModifiedOn = DateTime.Now;
            context.Entry(jobTracker).State = EntityState.Modified;
            await context.SaveChangesAsync();
            ///

            return Ok<Sid06QC>(newEntity);
        }
        
        [Route("carddelivery/create")]
        public async Task<IHttpActionResult> CreateCardDelivery(CardDelivery entity)
        {
            string userId = User.Identity.GetUserId();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            JobTracker jobTracker = await context.JobTrackers.FindAsync(entity.JobTrackerId);
            Job job = await context.Jobs.FindAsync(jobTracker.JobId);

            var depart = _repo.FindDepartmentByName("Quality Control");

            var jobStatusWIP = _repo.FindJobStatusByName("WIP");
            var jobStatusCompleted = _repo.FindJobStatusByName("Completed");
            var jobStatusQueue = _repo.FindJobStatusByName("Queue");
            var jobStatusNotRequired = _repo.FindJobStatusByName("Not Required");

            var jobTypePersoOnly = _repo.FindJobTypeByName("Perso Only");
            var jobTypePrintingOnly = _repo.FindJobTypeByName("Printing Only");
            var jobTypePrintingAndPerso = _repo.FindJobTypeByName("Printing And Perso");
            var jobTypePrintingPersoAndMailing = _repo.FindJobTypeByName("Printing, Perso And Mailing");
            var jobTypePersoAndMailing = _repo.FindJobTypeByName("Perso And Mailing");
            var serviceType = job.ServiceTypeId;

            //Todo: Redundant code section
            #region JobTrackerUpdateFlow

            int departmentId = 0;
            var dipatchUnit = _repo.FindDepartmentByName("Dispatch");
            var mailingUnit = _repo.FindDepartmentByName("Mailing");

            if (serviceType == jobTypePersoOnly.Id)
            {
                departmentId = dipatchUnit.Id;
            }
            else if (serviceType == jobTypePrintingOnly.Id)
            {
                departmentId = dipatchUnit.Id;
            }
            else if (serviceType == jobTypePrintingAndPerso.Id)
            {
                departmentId = dipatchUnit.Id;
            }
            else if (serviceType == jobTypePersoAndMailing.Id)
            {
                departmentId = mailingUnit.Id;
            }
            else if (serviceType == jobTypePrintingPersoAndMailing.Id)
            {
                departmentId = mailingUnit.Id;
            }

            #endregion
            
            //1. Create the Appproval
            var newEntity = new CardDelivery()
            {
                JobTrackerId = entity.JobTrackerId,
                DepartmentId = depart.Id,
                DeliveredById = userId,
                ConfirmedById = userId,
                DeliveredOn = DateTime.Now,
                ConfirmedOn = DateTime.Now,
                TargetDepartmentId = departmentId
            };

            context.CardDelivery.Add(newEntity);
            await context.SaveChangesAsync();
            
            return Ok<CardDelivery>(entity);
        }

        [Route("carddeliverylog/create")]
        public async Task<IHttpActionResult> CreateCardDeliveryLog(CardDeliveryLog entity)
        {
            userId = User.Identity.GetUserId();

            var department = _repo.FindDepartmentByName("Quality Control");
            var cardDelivery = _repo.FindCardDeliveryByTrackerDepart(entity.JobTrackerId, department.Id); //.Where(a => a.JobTrackerId == jobTrackerId && a.DepartmentId == department.Id);
            
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
                IsConfirmed = false,
                CreatedById = userId,
                CreatedOn = DateTime.Now,
                ConfirmedById = userId,
                ConfirmedOn = DateTime.Now,
                Description = entity.Description,
                BoxQty = entity.BoxQty
            };

            context.CardDeliveryLogs.Add(carddeliveryLog);
            await context.SaveChangesAsync();

            return Ok<CardDeliveryLog>(carddeliveryLog);
        }

        [Route("printdeliverylog/create")]
        public async Task<IHttpActionResult> CreatePrintDeliveryLog(CardDeliveryLog entity)
        {
            userId = User.Identity.GetUserId();

            var department = _repo.FindDepartmentByName("Printing");
            var cardDelivery = _repo.FindCardDeliveryByTrackerDepart(entity.JobTrackerId, department.Id);
            var jobTracker = await context.JobTrackers.FindAsync(entity.JobTrackerId);
            var job = await context.Jobs.FindAsync(jobTracker.JobId);

            var jobTypePrintingOnly = _repo.FindJobTypeByName("Printing Only");
            var jobTypePrintingAndPerso = _repo.FindJobTypeByName("Printing And Perso");
            var jobTypePrintingPersoAndMailing = _repo.FindJobTypeByName("Printing, Perso And Mailing");

            var jobStatusCompleted = _repo.FindJobStatusByName("Completed");
            var jobStatusQueue = _repo.FindJobStatusByName("Queue");


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
                IsConfirmed = false,
                CreatedById = userId,
                CreatedOn = DateTime.Now,
                ConfirmedById = userId,
                ConfirmedOn = DateTime.Now,
                Description = entity.Description,
                BoxQty = entity.BoxQty
            };

            context.CardDeliveryLogs.Add(carddeliveryLog);
            await context.SaveChangesAsync();
            
            // Update Tracker for PrintOnly
            #region JobTrackerUpdate
            if (job.ServiceTypeId == jobTypePrintingOnly.Id)
            {
                jobTracker.PrintingId = jobStatusCompleted.Id;
                jobTracker.DispatchId = jobStatusQueue.Id;
            }
            else if (job.ServiceTypeId == jobTypePrintingAndPerso.Id)
            {
                jobTracker.PrintingId = jobStatusCompleted.Id;
                jobTracker.FirstJobRunId = jobStatusQueue.Id;
            }
            else if (job.ServiceTypeId == jobTypePrintingPersoAndMailing.Id)
            {
                jobTracker.PrintingId = jobStatusCompleted.Id;
                jobTracker.FirstJobRunId = jobStatusQueue.Id;
            }

            jobTracker.ModifiedOn = DateTime.Now;
            context.Entry(jobTracker).State = EntityState.Modified;
            await context.SaveChangesAsync();
            #endregion
            
            return Ok<CardDeliveryLog>(carddeliveryLog);
        }
        
        [Route("wasteapproval/create")]
        public async Task<IHttpActionResult> CreateWasteApproval(CardAnalysisModel entity)
        {
            string userId = User.Identity.GetUserId();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            //Check if Waste > 0
            if (entity.QuantityBad > 0)
            {
                var cardWaste = new CardWasteAnalysis()
                {
                    JobTrackerId = entity.JobTrackerId,
                    JobSplitId = entity.JobSplitId,
                    JobSplitCEAnalysisId = entity.JobSplitCEAnalysisId,
                    WasteErrorSourceId = entity.WasteErrorSourceId,
                    QuantityBad = entity.QuantityBad,
                    WasteByUnitId = entity.WasteByUnitId,
                    CreatedById = userId,
                    CreatedOn = DateTime.Now,
                    ModifiedById = userId,
                    ModifiedOn = DateTime.Now
                };

                context.CardWasteAnalysis.Add(cardWaste);
                await context.SaveChangesAsync();
            }

            //Check if Held > 0
            if (entity.QuantityHeld > 0)
            {
                // for Held
                var cardHeld = new CardHeldAnalysis()
                {
                    JobTrackerId = entity.JobTrackerId,
                    JobSplitId = entity.JobSplitId,
                    JobSplitCEAnalysisId = entity.JobSplitCEAnalysisId,
                    WasteErrorSourceId = entity.WasteErrorSourceId,
                    QuantityHeld = entity.QuantityHeld,
                    WasteByUnitId = entity.WasteByUnitId,
                    CreatedById = userId,
                    CreatedOn = DateTime.Now,
                    ModifiedById = userId,
                    ModifiedOn = DateTime.Now
                };

                context.CardHeldAnalysis.Add(cardHeld);
                await context.SaveChangesAsync();
            }

            //1. CardWaste
            
            //2. Reset the CEAnalysis
            
            //3. Update JobCEAnalysis
            var jobCEAnalysis = await context.JobSplitCEAnalysis.FindAsync(entity.JobSplitCEAnalysisId);
            jobCEAnalysis.QuantityBad = 0;
            jobCEAnalysis.QuantityHeld = 0;          

            context.Entry(jobCEAnalysis).State = EntityState.Modified;
            await context.SaveChangesAsync();
           
            return Ok();
        }

        [Route("printwasteapproval/create")]
        public async Task<IHttpActionResult> CreatePrintWasteApproval(CardAnalysisModel entity)
        {
            string userId = User.Identity.GetUserId();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            //Check if Waste > 0
            if (entity.QuantityBad > 0)
            {
                var cardWaste = new PrintWasteAnalysis()
                {
                    JobTrackerId = entity.JobTrackerId,
                    JobSplitId = entity.JobSplitId,
                    JobSplitPrintCEAnalysisId = entity.JobSplitCEAnalysisId,
                    WasteErrorSourceId = entity.WasteErrorSourceId,
                    QuantityBad = entity.QuantityBad,
                    WasteByUnitId = entity.WasteByUnitId,
                    CreatedById = userId,
                    CreatedOn = DateTime.Now,
                    ModifiedById = userId,
                    ModifiedOn = DateTime.Now
                };

                context.PrintWasteAnalysis.Add(cardWaste);
                await context.SaveChangesAsync();
            }

            //Check if Held > 0
            if (entity.QuantityHeld > 0)
            {
                // for Held
                var cardHeld = new PrintHeldAnalysis()
                {
                    JobTrackerId = entity.JobTrackerId,
                    JobSplitId = entity.JobSplitId,
                    JobSplitPrintCEAnalysisId = entity.JobSplitCEAnalysisId,
                    WasteErrorSourceId = entity.WasteErrorSourceId,
                    QuantityHeld = entity.QuantityHeld,
                    WasteByUnitId = entity.WasteByUnitId,
                    CreatedById = userId,
                    CreatedOn = DateTime.Now,
                    ModifiedById = userId,
                    ModifiedOn = DateTime.Now
                };

                context.PrintHeldAnalysis.Add(cardHeld);
                await context.SaveChangesAsync();
            }

            //1. CardWaste

            //2. Reset the CEAnalysis
            
            //3. Update JobCEAnalysis
            var jobCEAnalysis = await context.JobSplitPrintCEAnalysis.FindAsync(entity.JobSplitCEAnalysisId);
            jobCEAnalysis.QuantityBad = 0;
            jobCEAnalysis.QuantityHeld = 0;
            jobCEAnalysis.ConfirmedHeld = entity.QuantityHeld;


            context.Entry(jobCEAnalysis).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok();
        }
        
        [HttpPut]
        [Route("waste-request/update/{id:int}")]
        public async Task<IHttpActionResult> UpdateQAWasteRequest(int id, JobSplitCEAnalysis entity)
        {
            string userId = User.Identity.GetUserId();
            JobSplitCEAnalysis existingEntity = await context.JobSplitCEAnalysis.FindAsync(entity.Id);
            JobSplit jobSplit = await context.JobSplits.FindAsync(entity.JobSplitId);

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

           
            context.JobSplitCEAnalysis.Attach(existingEntity);
            context.Entry(existingEntity).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok<JobSplitCEAnalysis>(existingEntity);

        }

        [HttpPut]
        [Route("jobslit-qc-analysis/update/{id:int}")]
        public async Task<IHttpActionResult> UpdateJobSlitQCAnalysis(int id, JobSplitQCAnalysis entity)
        {
            string userId = User.Identity.GetUserId();
            //JobSplitQCAnalysis existingEntity = await context.JobSplitQCAnalysis.FindAsync(entity.Id);
            JobSplit jobSplit = await context.JobSplits.FindAsync(entity.JobSplitId);

            //if (entity == null) { return NotFound(); }
            //if (id != entity.Id) { return BadRequest(ModelState); }
            //if (entity == null)
            //{
            //    //return BadRequest(ModelState);
            //    var message = string.Format("Entry is empty");
            //    HttpError err = new HttpError(message);
            //    return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, err));

            //}

            ////if (existingEntity != null && context.Entry(existingEntity).State != EntityState.Detached)
            ////{
            ////    context.Entry(existingEntity).State = EntityState.Detached;
            ////}

            //var local = context.Set<JobSplitQCAnalysis>().Local.FirstOrDefault(f => f.Id == entity.Id);
            //if (local != null) { context.Entry(local).State = EntityState.Detached; }

            // Update JobTracker
            var jobStatusWIP = _repo.FindJobStatusByName("WIP");
            var jobStatusCompleted = _repo.FindJobStatusByName("Completed");
            var jobStatusQueue = _repo.FindJobStatusByName("Queue");
            var jobStatusNotRequired = _repo.FindJobStatusByName("Not Required");

            var jobTracker = await context.JobTrackers.FindAsync(jobSplit.JobTrackerId);
            var job = await context.Jobs.FindAsync(jobTracker.JobId);

            var jobTypePersoOnly = _repo.FindJobTypeByName("Perso Only");
            var jobTypePrintingOnly = _repo.FindJobTypeByName("Printing Only");
            var jobTypePrintingAndPerso = _repo.FindJobTypeByName("Printing And Perso");
            var jobTypePrintingPersoAndMailing = _repo.FindJobTypeByName("Printing, Perso And Mailing");
            var jobTypePersoAndMailing = _repo.FindJobTypeByName("Perso And Mailing");
            var serviceType = job.ServiceTypeId;

            // Update JobTracker
            #region JobTrackerUpdateFlow

            if (serviceType == jobTypePrintingOnly.Id)
            {
                jobTracker.DispatchId = jobStatusQueue.Id;
            }
            else if (serviceType == jobTypePersoOnly.Id)
            {
                //jobTracker.DispatchId = jobStatusQueue.Id;
                if (jobTracker.QCId == jobStatusQueue.Id)
                {
                    jobTracker.QCId = jobStatusWIP.Id;
                    jobTracker.DispatchId = jobStatusQueue.Id;
                }
            }
            else if (serviceType == jobTypePrintingAndPerso.Id)
            {
                // For Perso Region
                if (jobTracker.QCId == jobStatusQueue.Id)
                {
                    jobTracker.QCId = jobStatusWIP.Id;
                    jobTracker.DispatchId = jobStatusQueue.Id;
                }
            }
            else if (serviceType == jobTypePersoAndMailing.Id)
            {
                //jobTracker.MailingId = jobStatusQueue.Id;
                if (jobTracker.QCId == jobStatusQueue.Id)
                {
                    jobTracker.QCId = jobStatusWIP.Id;
                    jobTracker.MailingId = jobStatusQueue.Id;
                }
            }
            else if (serviceType == jobTypePrintingPersoAndMailing.Id)
            {
                // For Perso Region
                if (jobTracker.QCId == jobStatusQueue.Id)
                {
                    jobTracker.QCId = jobStatusWIP.Id;
                    jobTracker.MailingId = jobStatusQueue.Id;
                }
                //jobTracker.MailingId = jobStatusQueue.Id;
            }

            #endregion

            jobTracker.ModifiedOn = DateTime.Now;
            context.Entry(jobTracker).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok();

        }

        [HttpPut]
        [Route("jobslit-printqc-analysis/update/{id:int}")]
        public async Task<IHttpActionResult> UpdateJobSlitPrintQCAnalysis(int id, JobSplitQCAnalysis entity)
        {
            string userId = User.Identity.GetUserId();
            JobSplit jobSplit = await context.JobSplits.FindAsync(entity.JobSplitId);

            if (entity == null) { return NotFound(); }
          
            var jobStatusWIP = _repo.FindJobStatusByName("WIP");
            var jobTracker = await context.JobTrackers.FindAsync(jobSplit.JobTrackerId);

            // Update JobTracker
            jobTracker.PrintQCId = jobStatusWIP.Id;
            jobTracker.ModifiedOn = DateTime.Now;
            context.Entry(jobTracker).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok<JobSplitQCAnalysis>(entity);

        }
        
        [HttpPut]
        [Route("jobslit/update/{id:int}")]
        public async Task<IHttpActionResult> UpdateJobSplit(int id, JobSplit entity)
        {
            string userId = User.Identity.GetUserId();
            JobSplit existingEntity = await context.JobSplits.FindAsync(entity.Id);

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

            var local = context.Set<JobSplit>().Local.FirstOrDefault(f => f.Id == entity.Id);
            if (local != null) { context.Entry(local).State = EntityState.Detached; }

            context.JobSplits.Attach(entity);
            context.Entry(entity).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok<JobSplit>(entity);

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

            existingEntity.IsQCInitialized = true;
            existingEntity.IsJobHandleByQC = true;
            
            context.Entry(existingEntity).State = EntityState.Modified;
            await context.SaveChangesAsync();

            var jobHandler = new JobHandler()
            {
                JobTrackerId = existingEntity.JobTrackerId,
                JobSplitId = existingEntity.JobSplitId,
                HandlerId = userId,
                CreatedOn = DateTime.Now,
                ModifiedOn = DateTime.Now,
                Remark = "QC"
            };

            //Create JobHandle
            var tx = CreateJobHandler(jobHandler);

            return Ok();

        }




    }
}
