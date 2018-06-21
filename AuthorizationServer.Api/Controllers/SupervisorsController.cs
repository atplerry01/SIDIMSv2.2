using AuthorizationServer.Api.Infrastructure;
using AuthorizationServer.Api.Models;
using Microsoft.AspNet.Identity;
using SID.Common.Model.Inventory;
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
    [RoutePrefix("api/supervisor")]
    public class SupervisorsController : ApiController
    {
        private ApplicationRepository _repo = null;
        readonly SidimBreezeRepository _repository = new SidimBreezeRepository();
        ApplicationDbContext context = new ApplicationDbContext();

        string _userId;

        public SupervisorsController()
        {
            _repo = new ApplicationRepository();
            //string userId = User.Identity.GetUserId();
            var userId = User.Identity.GetUserId();

        }



        [HttpPost]
        [Route("unflagjob/create")]
        public async Task<IHttpActionResult> CreateJobFlag(JobFlag entity)
        {
            _userId = User.Identity.GetUserId();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var jobTracker = await context.JobTrackers.FindAsync(entity.JobTrackerId);
            var jobFlag = await context.JobFlags.FindAsync(entity.Id);

            var updateJobTracker = jobTracker;
            updateJobTracker.IsFlag = false;
            var t0UpdateJobTracker = await UpdateJobTracker(updateJobTracker.Id, updateJobTracker);


            var updateJobFlag = jobFlag;
            updateJobFlag.IsResolved = true;
            var t0UpdateJobFlag = await UpdateJobFlag(updateJobFlag.Id, updateJobFlag);

            return Ok<JobFlag>(entity);
        }

        [HttpPost]
        [Route("updatejobandtracker/create")]
        public async Task<IHttpActionResult> CreateUpdateJobAndTracker(JobAndTrackerModel entity)
        {
            //Todo: Incase i have two tracker for the job
            _userId = User.Identity.GetUserId();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var jobTypePersoOnly = _repo.FindJobTypeByName("Perso Only");
            var jobTypePrintingOnly = _repo.FindJobTypeByName("Printing Only");
            var jobTypeMailingOnly = _repo.FindJobTypeByName("Mailing Only");
            var jobTypeDispatchOnly = _repo.FindJobTypeByName("Dispatch Only");
            var jobTypePrintingAndPerso = _repo.FindJobTypeByName("Printing And Perso");
            var jobTypePrintingPersoAndMailing = _repo.FindJobTypeByName("Printing, Perso And Mailing");
            var jobTypePersoAndMailing = _repo.FindJobTypeByName("Perso And Mailing");

            var jobStatusPending = _repo.FindJobStatusByName("Pending");
            var jobStatusWIP = _repo.FindJobStatusByName("WIP");
            var jobStatusCompleted = _repo.FindJobStatusByName("Completed");
            var jobStatusQueue = _repo.FindJobStatusByName("Queue");
            var jobStatusNotRequired = _repo.FindJobStatusByName("Not Required");

            var job = await context.Jobs.FindAsync(entity.JobId);
            var previousJob = job;
            var previousServiceId = job.ServiceTypeId;

            var jobTrackerByJob = _repo.FindJobTrackerByJobId(job.Id);
            var jobTracker = await context.JobTrackers.FindAsync(jobTrackerByJob.Id);
            var existingJobTracker = jobTrackerByJob;

            //if new Quantity detected and Inventory have already issued
            if (previousJob.Quantity != entity.Quantity && existingJobTracker.InventoryId == jobStatusCompleted.Id)
            {
                var message = string.Format("Job Quantity Cant be change after Inventory Issuance");
                var err = new HttpError(message);
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, err));
            }

            ////UpdateJob
            job.SidClientId = entity.SidClientId;
            job.SidCardTypeId = entity.SidCardTypeId;
            //Todo2: job.Remark = entity.Remark;
            job.ServiceTypeId = entity.ServiceTypeId;
            job.Quantity = entity.Quantity;
            var tJob = await UpdateJob(job.Id, job);

            // If New Service Detected
            if (previousServiceId != entity.ServiceTypeId)
            {
                #region JobTrackerSetup

                // reste the jobTracker to default and transfer the previous content
                if (entity.ServiceTypeId == jobTypePersoOnly.Id)
                {
                    jobTracker.CardOpsId = jobStatusCompleted.Id;
                    jobTracker.InventoryId = jobStatusQueue.Id;
                    jobTracker.PrintingId = jobStatusNotRequired.Id;
                    jobTracker.PrintQAId = jobStatusNotRequired.Id;
                    jobTracker.PrintQCId = jobStatusNotRequired.Id;
                    jobTracker.CardEngrId = jobStatusPending.Id;
                    jobTracker.QAId = jobStatusPending.Id;
                    jobTracker.FirstJobRunId = jobStatusQueue.Id;
                    jobTracker.CardEngrResumeId = jobStatusPending.Id;
                    jobTracker.QCId = jobStatusPending.Id;
                    jobTracker.MailingId = jobStatusNotRequired.Id;
                    jobTracker.DispatchId = jobStatusPending.Id; //Create dispatch setups
                    jobTracker.CustomerServiceId = jobStatusPending.Id;
                    jobTracker.MAudId = jobStatusPending.Id;

                    // Transfer the previous
                    jobTracker.ModifiedOn = DateTime.Now;

                    if (existingJobTracker.InventoryId == jobStatusCompleted.Id) { jobTracker.InventoryId = jobStatusCompleted.Id; }
                    if (existingJobTracker.FirstJobRunId == jobStatusCompleted.Id) { jobTracker.FirstJobRunId = jobStatusCompleted.Id; }
                    if (existingJobTracker.QAId == jobStatusCompleted.Id) { jobTracker.QAId = jobStatusCompleted.Id; }
                    if (existingJobTracker.CardEngrResumeId == jobStatusCompleted.Id) { jobTracker.CardEngrResumeId = jobStatusCompleted.Id; }
                    if (existingJobTracker.QCId == jobStatusCompleted.Id) { jobTracker.QCId = jobStatusCompleted.Id; }

                }
                else if (entity.ServiceTypeId == jobTypePrintingOnly.Id)
                {

                    jobTracker.CardOpsId = jobStatusCompleted.Id;
                    jobTracker.InventoryId = jobStatusQueue.Id;
                    jobTracker.PrintingId = jobStatusQueue.Id;
                    jobTracker.PrintQAId = jobStatusPending.Id;
                    jobTracker.PrintQCId = jobStatusPending.Id;
                    jobTracker.CardEngrId = jobStatusNotRequired.Id;
                    jobTracker.QAId = jobStatusNotRequired.Id;
                    jobTracker.FirstJobRunId = jobStatusNotRequired.Id;
                    jobTracker.CardEngrResumeId = jobStatusNotRequired.Id;
                    jobTracker.QCId = jobStatusNotRequired.Id;
                    jobTracker.MailingId = jobStatusNotRequired.Id;
                    jobTracker.DispatchId = jobStatusPending.Id; //Create dispatch setups
                    jobTracker.MAudId = jobStatusPending.Id;
                    jobTracker.CustomerServiceId = jobStatusPending.Id;

                    jobTracker.ModifiedOn = DateTime.Now;

                    // Overide Functions
                    if (existingJobTracker.InventoryId == jobStatusCompleted.Id) { jobTracker.InventoryId = jobStatusCompleted.Id; }
                    if (existingJobTracker.PrintingId == jobStatusCompleted.Id || existingJobTracker.PrintingId == jobStatusWIP.Id)
                    {
                        jobTracker.PrintingId = existingJobTracker.PrintingId;
                        jobTracker.PrintQAId = existingJobTracker.PrintQAId;
                        jobTracker.PrintQCId = existingJobTracker.PrintQCId;
                    }

                }
                else if (entity.ServiceTypeId == jobTypeMailingOnly.Id)
                {
                    jobTracker.CardOpsId = jobStatusCompleted.Id;
                    jobTracker.InventoryId = jobStatusQueue.Id;
                    jobTracker.PrintingId = jobStatusNotRequired.Id;
                    jobTracker.PrintQAId = jobStatusNotRequired.Id;
                    jobTracker.PrintQCId = jobStatusNotRequired.Id;
                    jobTracker.CardEngrId = jobStatusNotRequired.Id;
                    jobTracker.QAId = jobStatusNotRequired.Id;
                    jobTracker.FirstJobRunId = jobStatusNotRequired.Id;
                    jobTracker.CardEngrResumeId = jobStatusNotRequired.Id;
                    jobTracker.QCId = jobStatusNotRequired.Id;
                    jobTracker.MailingId = jobStatusQueue.Id;
                    jobTracker.DispatchId = jobStatusPending.Id; //Create dispatch setups
                    jobTracker.MAudId = jobStatusPending.Id;
                    jobTracker.CustomerServiceId = jobStatusPending.Id;

                    //jobTracker.InventoryId = existingJobTracker.InventoryId;
                    jobTracker.ModifiedOn = DateTime.Now;

                    if (existingJobTracker.InventoryId == jobStatusCompleted.Id) { jobTracker.InventoryId = jobStatusCompleted.Id; }
                    if (existingJobTracker.MailingId == jobStatusCompleted.Id || existingJobTracker.MailingId == jobStatusWIP.Id) { jobTracker.MailingId = existingJobTracker.MailingId; }

                }
                else if (entity.ServiceTypeId == jobTypeDispatchOnly.Id)
                {

                    jobTracker.CardOpsId = jobStatusCompleted.Id;
                    jobTracker.InventoryId = jobStatusQueue.Id;
                    jobTracker.PrintingId = jobStatusNotRequired.Id;
                    jobTracker.PrintQAId = jobStatusNotRequired.Id;
                    jobTracker.PrintQCId = jobStatusNotRequired.Id;
                    jobTracker.CardEngrId = jobStatusNotRequired.Id;
                    jobTracker.QAId = jobStatusNotRequired.Id;
                    jobTracker.FirstJobRunId = jobStatusNotRequired.Id;
                    jobTracker.CardEngrResumeId = jobStatusNotRequired.Id;
                    jobTracker.QCId = jobStatusNotRequired.Id;
                    jobTracker.MailingId = jobStatusNotRequired.Id;
                    jobTracker.DispatchId = jobStatusQueue.Id;
                    jobTracker.MAudId = jobStatusPending.Id;
                    jobTracker.CustomerServiceId = jobStatusPending.Id;

                    //jobTracker.InventoryId = existingJobTracker.InventoryId;
                    jobTracker.ModifiedOn = DateTime.Now;

                    if (existingJobTracker.InventoryId == jobStatusCompleted.Id) { jobTracker.InventoryId = jobStatusCompleted.Id; }

                }
                else if (entity.ServiceTypeId == jobTypePrintingAndPerso.Id)
                {
                    jobTracker.CardOpsId = jobStatusCompleted.Id;
                    jobTracker.InventoryId = jobStatusQueue.Id;
                    jobTracker.PrintingId = jobStatusQueue.Id;
                    jobTracker.PrintQAId = jobStatusPending.Id;
                    jobTracker.PrintQCId = jobStatusPending.Id;
                    jobTracker.CardEngrId = jobStatusPending.Id;
                    jobTracker.QAId = jobStatusPending.Id;
                    jobTracker.FirstJobRunId = jobStatusPending.Id;
                    jobTracker.CardEngrResumeId = jobStatusPending.Id;
                    jobTracker.QCId = jobStatusPending.Id;
                    jobTracker.MailingId = jobStatusNotRequired.Id;
                    jobTracker.DispatchId = jobStatusPending.Id; //Create dispatch setups
                    jobTracker.MAudId = jobStatusPending.Id;
                    jobTracker.CustomerServiceId = jobStatusPending.Id;

                    jobTracker.InventoryId = existingJobTracker.InventoryId;
                    jobTracker.ModifiedOn = DateTime.Now;


                    if (existingJobTracker.InventoryId == jobStatusCompleted.Id) { jobTracker.InventoryId = jobStatusCompleted.Id; }
                    if (existingJobTracker.PrintingId == jobStatusCompleted.Id || existingJobTracker.PrintingId == jobStatusWIP.Id)
                    {
                        jobTracker.PrintingId = existingJobTracker.PrintingId;
                        jobTracker.PrintQAId = existingJobTracker.PrintQAId;
                        jobTracker.PrintQCId = existingJobTracker.PrintQCId;
                    }

                    if (existingJobTracker.FirstJobRunId == jobStatusCompleted.Id || existingJobTracker.FirstJobRunId == jobStatusWIP.Id) { jobTracker.FirstJobRunId = existingJobTracker.FirstJobRunId; }
                    if (existingJobTracker.QAId == jobStatusCompleted.Id || existingJobTracker.QAId == jobStatusWIP.Id) { jobTracker.QAId = existingJobTracker.QAId; }
                    if (existingJobTracker.CardEngrResumeId == jobStatusCompleted.Id || existingJobTracker.CardEngrResumeId == jobStatusWIP.Id) { jobTracker.CardEngrResumeId = existingJobTracker.CardEngrResumeId; }
                    if (existingJobTracker.QCId == jobStatusCompleted.Id || existingJobTracker.QCId == jobStatusWIP.Id) { jobTracker.QCId = existingJobTracker.QCId; }


                }
                else if (entity.ServiceTypeId == jobTypePersoAndMailing.Id)
                {
                    jobTracker.CardOpsId = jobStatusCompleted.Id;
                    jobTracker.InventoryId = jobStatusQueue.Id;
                    jobTracker.PrintingId = jobStatusNotRequired.Id;
                    jobTracker.PrintQAId = jobStatusNotRequired.Id;
                    jobTracker.PrintQCId = jobStatusNotRequired.Id;
                    jobTracker.CardEngrId = jobStatusQueue.Id;
                    jobTracker.QAId = jobStatusPending.Id;
                    jobTracker.FirstJobRunId = jobStatusQueue.Id;
                    jobTracker.CardEngrResumeId = jobStatusPending.Id;
                    jobTracker.QCId = jobStatusPending.Id;
                    jobTracker.MailingId = jobStatusPending.Id;
                    jobTracker.DispatchId = jobStatusPending.Id;
                    jobTracker.MAudId = jobStatusPending.Id;
                    jobTracker.CustomerServiceId = jobStatusPending.Id;

                    jobTracker.InventoryId = existingJobTracker.InventoryId;
                    jobTracker.ModifiedOn = DateTime.Now;

                    if (existingJobTracker.InventoryId == jobStatusCompleted.Id) { jobTracker.InventoryId = jobStatusCompleted.Id; }
                    if (existingJobTracker.FirstJobRunId == jobStatusCompleted.Id || existingJobTracker.FirstJobRunId == jobStatusWIP.Id) { jobTracker.FirstJobRunId = existingJobTracker.FirstJobRunId; }
                    if (existingJobTracker.QAId == jobStatusCompleted.Id || existingJobTracker.QAId == jobStatusWIP.Id) { jobTracker.QAId = existingJobTracker.QAId; }
                    if (existingJobTracker.CardEngrResumeId == jobStatusCompleted.Id || existingJobTracker.CardEngrResumeId == jobStatusWIP.Id) { jobTracker.CardEngrResumeId = existingJobTracker.CardEngrResumeId; }
                    if (existingJobTracker.QCId == jobStatusCompleted.Id || existingJobTracker.QCId == jobStatusWIP.Id) { jobTracker.QCId = existingJobTracker.QCId; }
                    if (existingJobTracker.MailingId == jobStatusCompleted.Id || existingJobTracker.MailingId == jobStatusWIP.Id) { jobTracker.MailingId = existingJobTracker.MailingId; }

                }
                else if (entity.ServiceTypeId == jobTypePrintingPersoAndMailing.Id)
                {
                    jobTracker.CardOpsId = jobStatusCompleted.Id;
                    jobTracker.InventoryId = jobStatusQueue.Id;
                    jobTracker.PrintingId = jobStatusQueue.Id;
                    jobTracker.PrintQAId = jobStatusPending.Id;
                    jobTracker.PrintQCId = jobStatusPending.Id;
                    jobTracker.CardEngrId = jobStatusPending.Id;
                    jobTracker.QAId = jobStatusPending.Id;
                    jobTracker.FirstJobRunId = jobStatusPending.Id;
                    jobTracker.CardEngrResumeId = jobStatusPending.Id;
                    jobTracker.QCId = jobStatusPending.Id;
                    jobTracker.MailingId = jobStatusPending.Id;
                    jobTracker.DispatchId = jobStatusPending.Id;
                    jobTracker.MAudId = jobStatusPending.Id;
                    jobTracker.CustomerServiceId = jobStatusPending.Id;

                    jobTracker.InventoryId = existingJobTracker.InventoryId;
                    jobTracker.ModifiedOn = DateTime.Now;

                    if (existingJobTracker.InventoryId == jobStatusCompleted.Id) { jobTracker.InventoryId = jobStatusCompleted.Id; }
                    if (existingJobTracker.PrintingId == jobStatusCompleted.Id || existingJobTracker.PrintingId == jobStatusWIP.Id)
                    {
                        jobTracker.PrintingId = existingJobTracker.PrintingId;
                        jobTracker.PrintQAId = existingJobTracker.PrintQAId;
                        jobTracker.PrintQCId = existingJobTracker.PrintQCId;
                    }

                    if (existingJobTracker.FirstJobRunId == jobStatusCompleted.Id || existingJobTracker.FirstJobRunId == jobStatusWIP.Id) { jobTracker.FirstJobRunId = existingJobTracker.FirstJobRunId; }
                    if (existingJobTracker.QAId == jobStatusCompleted.Id || existingJobTracker.QAId == jobStatusWIP.Id) { jobTracker.QAId = existingJobTracker.QAId; }
                    if (existingJobTracker.CardEngrResumeId == jobStatusCompleted.Id || existingJobTracker.CardEngrResumeId == jobStatusWIP.Id) { jobTracker.CardEngrResumeId = existingJobTracker.CardEngrResumeId; }
                    if (existingJobTracker.QCId == jobStatusCompleted.Id || existingJobTracker.QCId == jobStatusWIP.Id) { jobTracker.QCId = existingJobTracker.QCId; }
                    if (existingJobTracker.MailingId == jobStatusCompleted.Id || existingJobTracker.MailingId == jobStatusWIP.Id) { jobTracker.MailingId = existingJobTracker.MailingId; }

                }

                #endregion

                var t0UpdateJobTracker = await UpdateJobTracker(jobTracker.Id, jobTracker);

            }

            return Ok<Job>(job);
        }


        public async Task<IHttpActionResult> UpdateJob(int id, Job entity)
        {
            var existingEntity = await context.Jobs.FindAsync(entity.Id);
            if (id != entity.Id) { return BadRequest(ModelState); }

            if (existingEntity != null && context.Entry(existingEntity).State != EntityState.Detached)
            {
                context.Entry(existingEntity).State = EntityState.Detached;
            }

            var local = context.Set<Job>().Local.FirstOrDefault(f => f.Id == entity.Id);
            if (local != null) { context.Entry(local).State = EntityState.Detached; }

            context.Jobs.Attach(entity);
            context.Entry(entity).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok<Job>(entity);

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

        public async Task<IHttpActionResult> UpdateJobFlag(int id, JobFlag entity)
        {
            _userId = User.Identity.GetUserId();
            var existingEntity = await context.JobFlags.FindAsync(entity.Id);
            if (id != entity.Id) { return BadRequest(ModelState); }

            if (existingEntity != null && context.Entry(existingEntity).State != EntityState.Detached)
            {
                context.Entry(existingEntity).State = EntityState.Detached;
            }

            var local = context.Set<JobFlag>().Local.FirstOrDefault(f => f.Id == entity.Id);
            if (local != null) { context.Entry(local).State = EntityState.Detached; }

            entity = existingEntity;
            entity.ModifiedOn = DateTime.Now;
            entity.ModifiedById = _userId;

            context.JobFlags.Attach(entity);
            context.Entry(entity).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok<JobFlag>(entity);

        }


        [HttpPost]
        [Route("reset")]
        public async Task<IHttpActionResult> CreateResetProcess()
        {

            // Server Job Reset
            #region ServerJobQueues

            var serverJobs = _repository.ServerJobQueues;

            foreach (var serverJob in serverJobs)
            {
                serverJob.IsTreated = false;
                var t1 = await UpdateServerJobQueue(serverJob.Id, serverJob);
            }

            #endregion

            return Ok("Ok");
        }

        /// ServerJobs
        public async Task<IHttpActionResult> UpdateServerJobQueue(int id, ServerJobQueue entity)
        {
            string userId = User.Identity.GetUserId();
            ServerJobQueue existingEntity = await context.ServerJobQueues.FindAsync(entity.Id);

            if (entity == null)
            {
                return NotFound();
            }

            if (id != entity.Id)
            {
                return BadRequest(ModelState);
            }

            if (existingEntity != null && context.Entry(existingEntity).State != EntityState.Detached)
            {
                context.Entry(existingEntity).State = EntityState.Detached;
            }

            var local = context.Set<JobTracker>().Local.FirstOrDefault(f => f.Id == entity.Id);
            if (local != null) { context.Entry(local).State = EntityState.Detached; }

            context.ServerJobQueues.Attach(entity);
            context.Entry(entity).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok<ServerJobQueue>(entity);

        }

        [HttpPost]
        [Route("jobTracker/delete/{jobTrackerId:int}")]
        public async Task<IHttpActionResult> DeleteJobTracker(int jobTrackerId)
        {
            var userId = User.Identity.GetUserId();
            var jobStatusDeleted = _repo.FindJobStatusByName("Deleted");

            // Update JobTracker Status
            var jobTracker = await context.JobTrackers.Include(j => j.Job).SingleOrDefaultAsync(t => t.Id == jobTrackerId);
            jobTracker.IsDeleted = true;
            jobTracker.JobStatusId = jobStatusDeleted.Id;

            context.JobTrackers.Attach(jobTracker);
            context.Entry(jobTracker).State = EntityState.Modified;
            await context.SaveChangesAsync();

            // Update Job Status
            var job = jobTracker.Job;
            job.JobStatusId = jobStatusDeleted.Id;

            var jobVariant = _repo.FindJobVariantByJobId(job.Id, jobTracker.Id);

            if (jobVariant != null)
            {
                #region RevertProcess
                
                var clientVaultReport = _repo.FindClientVaultReportBySidProductId(jobVariant.SidProductId);
                var clientStockReportForTheDay = _repo.FindClientStocktReportForTheDay(jobVariant.SidProductId, job.JobName);
                var cardIssuanceLog = _repo.FindCardIssuanceLogByJobTrackerId(jobTracker.Id);
                var cardIssuance = await context.CardIssuances.FindAsync(cardIssuanceLog.CardIssuanceId);
                if (clientStockReportForTheDay == null)
                {
                    //create new
                    var newClientStockReport = new ClientStockReport()
                    {
                        SidProductId = jobVariant.SidProductId,
                        ClientVaultReportId = clientVaultReport.Id,
                        FileName = job.JobName,
                        QtyIssued = 0,
                        WasteQty = 0,
                        ReturnQty = 0,
                        OpeningStock = 0,
                        ClosingStock = 0,
                        CreatedOn = DateTime.Now
                    };
                    var csr = await CreateClientStockReport(newClientStockReport);

                }

                var clientStockReportForTheDay2 = _repo.FindClientStocktReportForTheDay(jobVariant.SidProductId, job.JobName);

                // Update Issuance
                cardIssuance.TotalQuantityIssued -= cardIssuanceLog.QuantityIssued;
                cardIssuance.TotalQuantityRemain = 0;
                var t33 = await UpdateCardIssuance(cardIssuance.Id, cardIssuance);

                //create a new card issuance log
                var newCardIssuanceLog = new CardIssuanceLog()
                {
                    JobTrackerId = jobTracker.Id,
                    CardIssuanceId = cardIssuanceLog.CardIssuanceId,
                    IssuanceTypeId = cardIssuanceLog.IssuanceTypeId,
                    TotalQuantity = job.Quantity,
                    QuantityIssued = -(cardIssuanceLog.QuantityIssued),
                    QuantityRemain = 0,
                    IssuanceId = userId,
                    CollectorId = cardIssuanceLog.CollectorId, //Todo: Change to Inventory users
                    IssuedDate = DateTime.Now
                };
                var t4 = await CreateCardIssuanceLog(newCardIssuanceLog);

                // Stock Log
                //============
                // Update the Vault and StockReport
                var updateVault = clientVaultReport;
                updateVault.OpeningStock = updateVault.ClosingStock;
                updateVault.ClosingStock += cardIssuanceLog.QuantityIssued; //Add the return card
                var t0UpdateClientVault = await UpdateClientVaultReport(updateVault.Id, updateVault);

                // Update the Vault and StockReport
                var newClientStockLog = new ClientStockLog()
                {
                    ClientStockReportId = clientStockReportForTheDay2.Id,
                    CardIssuanceId = cardIssuance.Id,
                    IssuanceQty = cardIssuanceLog.QuantityIssued,
                    OpeningStock = updateVault.OpeningStock,
                    ClosingStock = updateVault.OpeningStock + cardIssuanceLog.QuantityIssued
                };
                await CreateClientStockLog(newClientStockLog);

                // ClientStockReport
                var updateDayStock = clientStockReportForTheDay2;
                updateDayStock.FileName = job.JobName;
                updateDayStock.OpeningStock = updateVault.OpeningStock;
                updateDayStock.ClosingStock = updateVault.OpeningStock + cardIssuanceLog.QuantityIssued;
                updateDayStock.ReturnQty += cardIssuanceLog.QuantityIssued;
                updateDayStock.CreatedOn = DateTime.Now;
                await UpdateClientStockReport(updateDayStock.Id, updateDayStock);

                #endregion
            }

            return Ok(jobTracker);
        }


        [HttpPost]
        [Route("jobTracker/revert/{jobTrackerId:int}")]
        public async Task<IHttpActionResult> RevertJobTracker(int jobTrackerId)
        {
            var userId = User.Identity.GetUserId();

            var jobTracker = await context.JobTrackers.Include(a => a.Job).SingleOrDefaultAsync(j => j.Id == jobTrackerId);
            var serviceType = await context.ServiceTypes.FindAsync(jobTracker.Job.ServiceTypeId);
            var job = jobTracker.Job;

            #region Definations
            var jobStatusPending = _repo.FindJobStatusByName("Pending");
            var jobStatusCompleted = _repo.FindJobStatusByName("Completed");
            var jobStatusQueue = _repo.FindJobStatusByName("Queue");
            var jobStatusReverted = _repo.FindJobStatusByName("Reverted");
            var jobStatusNotRequired = _repo.FindJobStatusByName("Not Required");

            var jobTypePersoOnly = _repo.FindJobTypeByName("Perso Only");
            var jobTypePrintingOnly = _repo.FindJobTypeByName("Printing Only");
            var jobTypeMailingOnly = _repo.FindJobTypeByName("Mailing Only");
            var jobTypeDispatchOnly = _repo.FindJobTypeByName("Dispatch Only");
            var jobTypePrintingAndPerso = _repo.FindJobTypeByName("Printing And Perso");
            var jobTypePrintingPersoAndMailing = _repo.FindJobTypeByName("Printing, Perso And Mailing");
            var jobTypePersoAndMailing = _repo.FindJobTypeByName("Perso And Mailing");

            #endregion

            // Job Status
            job.JobStatusId = jobStatusReverted.Id;

            context.Jobs.Attach(job);
            context.Entry(job).State = EntityState.Modified;
            await context.SaveChangesAsync();

            //Update JobTracker
            #region JobTrackerSetup

            if (serviceType.Id == jobTypePersoOnly.Id)
            {
                #region PersoOnly
                jobTracker.CardOpsId = jobStatusCompleted.Id;
                jobTracker.InventoryId = jobStatusQueue.Id;
                jobTracker.PrintingId = jobStatusNotRequired.Id;
                jobTracker.PrintQAId = jobStatusNotRequired.Id;
                jobTracker.PrintQCId = jobStatusNotRequired.Id;
                jobTracker.CardEngrId = jobStatusQueue.Id;
                jobTracker.QAId = jobStatusPending.Id;
                jobTracker.FirstJobRunId = jobStatusQueue.Id;
                jobTracker.CardEngrResumeId = jobStatusPending.Id;
                jobTracker.QCId = jobStatusPending.Id;
                jobTracker.MailingId = jobStatusNotRequired.Id;
                jobTracker.DispatchId = jobStatusPending.Id; //Create dispatch setups
                jobTracker.CustomerServiceId = jobStatusPending.Id;
                jobTracker.MAudId = jobStatusPending.Id;
                jobTracker.ModifiedOn = DateTime.Now;
                #endregion
            }
            else if (serviceType.Id == jobTypePrintingOnly.Id)
            {
                #region PrintOnly
                jobTracker.CardOpsId = jobStatusCompleted.Id;
                jobTracker.InventoryId = jobStatusQueue.Id;
                jobTracker.PrintingId = jobStatusQueue.Id;
                jobTracker.PrintQAId = jobStatusPending.Id;
                jobTracker.PrintQCId = jobStatusPending.Id;
                jobTracker.CardEngrId = jobStatusNotRequired.Id;
                jobTracker.QAId = jobStatusNotRequired.Id;
                jobTracker.FirstJobRunId = jobStatusNotRequired.Id;
                jobTracker.CardEngrResumeId = jobStatusNotRequired.Id;
                jobTracker.QCId = jobStatusNotRequired.Id;
                jobTracker.MailingId = jobStatusNotRequired.Id;
                jobTracker.DispatchId = jobStatusPending.Id; //Create dispatch setups
                jobTracker.MAudId = jobStatusPending.Id;
                jobTracker.CustomerServiceId = jobStatusPending.Id;
                jobTracker.ModifiedOn = DateTime.Now;
                #endregion
            }
            else if (serviceType.Id == jobTypeMailingOnly.Id)
            {
                #region MailingOnly
                jobTracker.CardOpsId = jobStatusCompleted.Id;
                jobTracker.InventoryId = jobStatusQueue.Id;
                jobTracker.PrintingId = jobStatusNotRequired.Id;
                jobTracker.PrintQAId = jobStatusNotRequired.Id;
                jobTracker.PrintQCId = jobStatusNotRequired.Id;
                jobTracker.CardEngrId = jobStatusNotRequired.Id;
                jobTracker.QAId = jobStatusNotRequired.Id;
                jobTracker.FirstJobRunId = jobStatusNotRequired.Id;
                jobTracker.CardEngrResumeId = jobStatusNotRequired.Id;
                jobTracker.QCId = jobStatusNotRequired.Id;
                jobTracker.MailingId = jobStatusQueue.Id;
                jobTracker.DispatchId = jobStatusPending.Id; //Create dispatch setups
                jobTracker.MAudId = jobStatusPending.Id;
                jobTracker.CustomerServiceId = jobStatusPending.Id;
                jobTracker.ModifiedOn = DateTime.Now;

                //context.JobTrackers.Add(jobTrackerMailingOnly);
                //await context.SaveChangesAsync();
                #endregion
            }
            else if (serviceType.Id == jobTypeDispatchOnly.Id)
            {
                #region DispatchOnly
                jobTracker.CardOpsId = jobStatusCompleted.Id;
                jobTracker.InventoryId = jobStatusQueue.Id;
                jobTracker.PrintingId = jobStatusNotRequired.Id;
                jobTracker.PrintQAId = jobStatusNotRequired.Id;
                jobTracker.PrintQCId = jobStatusNotRequired.Id;
                jobTracker.CardEngrId = jobStatusNotRequired.Id;
                jobTracker.QAId = jobStatusNotRequired.Id;
                jobTracker.FirstJobRunId = jobStatusNotRequired.Id;
                jobTracker.CardEngrResumeId = jobStatusNotRequired.Id;
                jobTracker.QCId = jobStatusNotRequired.Id;
                jobTracker.MailingId = jobStatusNotRequired.Id;
                jobTracker.DispatchId = jobStatusQueue.Id; //Create dispatch setups
                jobTracker.MAudId = jobStatusPending.Id;
                jobTracker.CustomerServiceId = jobStatusPending.Id;
                jobTracker.ModifiedOn = DateTime.Now;

                //context.JobTrackers.Add(jobTrackerMailingOnly);
                //await context.SaveChangesAsync();
                #endregion
            }
            else if (serviceType.Id == jobTypePrintingAndPerso.Id)
            {
                #region PersoPrinting
                jobTracker.CardOpsId = jobStatusCompleted.Id;
                jobTracker.InventoryId = jobStatusQueue.Id;
                jobTracker.PrintingId = jobStatusQueue.Id;
                jobTracker.PrintQAId = jobStatusPending.Id;
                jobTracker.PrintQCId = jobStatusPending.Id;
                jobTracker.CardEngrId = jobStatusPending.Id;
                jobTracker.QAId = jobStatusPending.Id;
                jobTracker.FirstJobRunId = jobStatusPending.Id;
                jobTracker.CardEngrResumeId = jobStatusPending.Id;
                jobTracker.QCId = jobStatusPending.Id;
                jobTracker.MailingId = jobStatusNotRequired.Id;
                jobTracker.DispatchId = jobStatusPending.Id; //Create dispatch setups
                jobTracker.MAudId = jobStatusPending.Id;
                jobTracker.CustomerServiceId = jobStatusPending.Id;
                jobTracker.ModifiedOn = DateTime.Now;

                //context.JobTrackers.Add(jobTrackerPersoPrinting);
                //await context.SaveChangesAsync();
                #endregion

            }
            else if (serviceType.Id == jobTypePersoAndMailing.Id)
            {
                #region PersoAndMailing
                jobTracker.CardOpsId = jobStatusCompleted.Id;
                jobTracker.InventoryId = jobStatusQueue.Id;
                jobTracker.PrintingId = jobStatusNotRequired.Id;
                jobTracker.PrintQAId = jobStatusNotRequired.Id;
                jobTracker.PrintQCId = jobStatusNotRequired.Id;
                jobTracker.CardEngrId = jobStatusQueue.Id;
                jobTracker.QAId = jobStatusPending.Id;
                jobTracker.FirstJobRunId = jobStatusQueue.Id;
                jobTracker.CardEngrResumeId = jobStatusPending.Id;
                jobTracker.QCId = jobStatusPending.Id;
                jobTracker.MailingId = jobStatusPending.Id;
                jobTracker.DispatchId = jobStatusPending.Id;
                jobTracker.MAudId = jobStatusPending.Id;
                jobTracker.CustomerServiceId = jobStatusPending.Id;
                jobTracker.ModifiedOn = DateTime.Now;

                //context.JobTrackers.Add(jobTrackerPersoOnly);
                //await context.SaveChangesAsync();
                #endregion

            }
            else if (serviceType.Id == jobTypePrintingPersoAndMailing.Id)
            {
                #region PersoAndMailing
                jobTracker.CardOpsId = jobStatusCompleted.Id;
                jobTracker.InventoryId = jobStatusQueue.Id;
                jobTracker.PrintingId = jobStatusQueue.Id;
                jobTracker.PrintQAId = jobStatusPending.Id;
                jobTracker.PrintQCId = jobStatusPending.Id;
                jobTracker.CardEngrId = jobStatusPending.Id;
                jobTracker.QAId = jobStatusPending.Id;
                jobTracker.FirstJobRunId = jobStatusPending.Id;
                jobTracker.CardEngrResumeId = jobStatusPending.Id;
                jobTracker.QCId = jobStatusPending.Id;
                jobTracker.MailingId = jobStatusPending.Id;
                jobTracker.DispatchId = jobStatusPending.Id;
                jobTracker.MAudId = jobStatusPending.Id;
                jobTracker.CustomerServiceId = jobStatusPending.Id;
                jobTracker.ModifiedOn = DateTime.Now;

                #endregion
            }

            jobTracker.JobStatusId = jobStatusReverted.Id;
            context.JobTrackers.Attach(jobTracker);
            context.Entry(jobTracker).State = EntityState.Modified;
            await context.SaveChangesAsync();

            #endregion

            var jobVariant = _repo.FindJobVariantByJobId(job.Id, jobTracker.Id);

            if (jobVariant != null)
            {
                #region RevertProcess

                var clientVaultReport = _repo.FindClientVaultReportBySidProductId(jobVariant.SidProductId);
                var clientStockReportForTheDay = _repo.FindClientStocktReportForTheDay(jobVariant.SidProductId, job.JobName);
                var cardIssuanceLog = _repo.FindCardIssuanceLogByJobTrackerId(jobTracker.Id);
                var cardIssuance = await context.CardIssuances.FindAsync(cardIssuanceLog.CardIssuanceId);
                if (clientStockReportForTheDay == null)
                {
                    //create new
                    var newClientStockReport = new ClientStockReport()
                    {
                        SidProductId = jobVariant.SidProductId,
                        ClientVaultReportId = clientVaultReport.Id,
                        FileName = job.JobName,
                        QtyIssued = 0,
                        WasteQty = 0,
                        ReturnQty = 0,
                        OpeningStock = 0,
                        ClosingStock = 0,
                        CreatedOn = DateTime.Now
                    };
                    var csr = await CreateClientStockReport(newClientStockReport);

                }

                var clientStockReportForTheDay2 = _repo.FindClientStocktReportForTheDay(jobVariant.SidProductId, job.JobName);

                // Update Issuance
                cardIssuance.TotalQuantityIssued -= cardIssuanceLog.QuantityIssued;
                cardIssuance.TotalQuantityRemain = 0;
                var t33 = await UpdateCardIssuance(cardIssuance.Id, cardIssuance);

                //create a new card issuance log
                var newCardIssuanceLog = new CardIssuanceLog()
                {
                    JobTrackerId = jobTracker.Id,
                    CardIssuanceId = cardIssuanceLog.CardIssuanceId,
                    IssuanceTypeId = cardIssuanceLog.IssuanceTypeId,
                    TotalQuantity = job.Quantity,
                    QuantityIssued = -(cardIssuanceLog.QuantityIssued),
                    QuantityRemain = 0,
                    IssuanceId = userId,
                    CollectorId = cardIssuanceLog.CollectorId, //Todo: Change to Inventory users
                    IssuedDate = DateTime.Now
                };
                var t4 = await CreateCardIssuanceLog(newCardIssuanceLog);

                // Stock Log
                //============
                // Update the Vault and StockReport
                var updateVault = clientVaultReport;
                updateVault.OpeningStock = updateVault.ClosingStock;
                updateVault.ClosingStock += cardIssuanceLog.QuantityIssued; //Add the return card
                var t0UpdateClientVault = await UpdateClientVaultReport(updateVault.Id, updateVault);

                // Update the Vault and StockReport
                var newClientStockLog = new ClientStockLog()
                {
                    ClientStockReportId = clientStockReportForTheDay2.Id,
                    CardIssuanceId = cardIssuance.Id,
                    IssuanceQty = cardIssuanceLog.QuantityIssued,
                    OpeningStock = updateVault.OpeningStock,
                    ClosingStock = updateVault.OpeningStock + cardIssuanceLog.QuantityIssued
                };
                await CreateClientStockLog(newClientStockLog);

                // ClientStockReport
                var updateDayStock = clientStockReportForTheDay2;
                updateDayStock.FileName = job.JobName;
                updateDayStock.OpeningStock = updateVault.OpeningStock;
                updateDayStock.ClosingStock = updateVault.OpeningStock + cardIssuanceLog.QuantityIssued;
                updateDayStock.ReturnQty += cardIssuanceLog.QuantityIssued;
                updateDayStock.CreatedOn = DateTime.Now;
                await UpdateClientStockReport(updateDayStock.Id, updateDayStock);

                #endregion

            }
            
            return Ok(jobTracker);
        }


        //Inventory Unit Revert
        [HttpPost]
        [Route("inventory/revert/{jobTrackerId:int}")]
        public async Task<IHttpActionResult> InventoryUnitRevert(int jobTrackerId)
        {
            var userId = User.Identity.GetUserId();

            var jobTracker = await context.JobTrackers.Include(a => a.Job).SingleOrDefaultAsync(j => j.Id == jobTrackerId);
            var serviceType = await context.ServiceTypes.FindAsync(jobTracker.Job.ServiceTypeId);
            var job = jobTracker.Job;

            #region Definations
            var jobStatusPending = _repo.FindJobStatusByName("Pending");
            var jobStatusQueue = _repo.FindJobStatusByName("Queue");
            var jobStatusReverted = _repo.FindJobStatusByName("Reverted");

            var jobTypePersoOnly = _repo.FindJobTypeByName("Perso Only");
            var jobTypePrintingOnly = _repo.FindJobTypeByName("Printing Only");
            var jobTypeMailingOnly = _repo.FindJobTypeByName("Mailing Only");
            var jobTypeDispatchOnly = _repo.FindJobTypeByName("Dispatch Only");
            var jobTypePrintingAndPerso = _repo.FindJobTypeByName("Printing And Perso");
            var jobTypePrintingPersoAndMailing = _repo.FindJobTypeByName("Printing, Perso And Mailing");
            var jobTypePersoAndMailing = _repo.FindJobTypeByName("Perso And Mailing");

            #endregion

            job.JobStatusId = jobStatusReverted.Id;

            context.Jobs.Attach(job);
            context.Entry(job).State = EntityState.Modified;
            await context.SaveChangesAsync();

            //Update JobTracker
            #region JobTrackerSetup

            if (serviceType.Id == jobTypePersoOnly.Id)
            {
                #region PersoOnly
                jobTracker.InventoryId = jobStatusQueue.Id;
                jobTracker.CardEngrId = jobStatusPending.Id;
                jobTracker.ModifiedOn = DateTime.Now;
                #endregion
            }
            else if (serviceType.Id == jobTypePrintingOnly.Id)
            {
                #region PrintOnly
                jobTracker.InventoryId = jobStatusQueue.Id;
                jobTracker.PrintingId = jobStatusPending.Id;
                jobTracker.PrintQAId = jobStatusPending.Id;
                jobTracker.PrintQCId = jobStatusPending.Id;
             
                jobTracker.ModifiedOn = DateTime.Now;
                #endregion
            }
            else if (serviceType.Id == jobTypeMailingOnly.Id)
            {
                #region MailingOnly
                jobTracker.InventoryId = jobStatusQueue.Id;   
                jobTracker.MailingId = jobStatusPending.Id;
                jobTracker.ModifiedOn = DateTime.Now;
                #endregion
            }
            else if (serviceType.Id == jobTypeDispatchOnly.Id)
            {
                #region DispatchOnly
                jobTracker.InventoryId = jobStatusQueue.Id;
                jobTracker.DispatchId = jobStatusPending.Id; 
                jobTracker.ModifiedOn = DateTime.Now;
                #endregion
            }
            else if (serviceType.Id == jobTypePrintingAndPerso.Id)
            {
                #region PersoPrinting
                jobTracker.InventoryId = jobStatusQueue.Id;
                jobTracker.PrintingId = jobStatusPending.Id;
                jobTracker.CustomerServiceId = jobStatusPending.Id;
                jobTracker.ModifiedOn = DateTime.Now;
                #endregion

            }
            else if (serviceType.Id == jobTypePersoAndMailing.Id)
            {
                #region PersoAndMailing
                jobTracker.InventoryId = jobStatusQueue.Id;
                jobTracker.CardEngrId = jobStatusPending.Id;
                jobTracker.ModifiedOn = DateTime.Now;
                #endregion

            }
            else if (serviceType.Id == jobTypePrintingPersoAndMailing.Id)
            {
                #region PersoAndMailing
                jobTracker.InventoryId = jobStatusQueue.Id;
                jobTracker.PrintingId = jobStatusPending.Id;
                jobTracker.ModifiedOn = DateTime.Now;

                #endregion
            }

            jobTracker.JobStatusId = jobStatusPending.Id;
            context.JobTrackers.Attach(jobTracker);
            context.Entry(jobTracker).State = EntityState.Modified;
            await context.SaveChangesAsync();

            #endregion
            
            var jobVariant = _repo.FindJobVariantByJobId(job.Id, jobTracker.Id);

            if (jobVariant != null)
            {
                #region RevertProcess

                var clientVaultReport = _repo.FindClientVaultReportBySidProductId(jobVariant.SidProductId);
                var clientStockReportForTheDay = _repo.FindClientStocktReportForTheDay(jobVariant.SidProductId, job.JobName);
                var cardIssuanceLog = _repo.FindCardIssuanceLogByJobTrackerId(jobTracker.Id);
                var cardIssuance = await context.CardIssuances.FindAsync(cardIssuanceLog.CardIssuanceId);
                if (clientStockReportForTheDay == null)
                {
                    //create new
                    var newClientStockReport = new ClientStockReport()
                    {
                        SidProductId = jobVariant.SidProductId,
                        ClientVaultReportId = clientVaultReport.Id,
                        FileName = job.JobName,
                        QtyIssued = 0,
                        WasteQty = 0,
                        ReturnQty = 0,
                        OpeningStock = 0,
                        ClosingStock = 0,
                        CreatedOn = DateTime.Now
                    };
                    var csr = await CreateClientStockReport(newClientStockReport);

                }

                var clientStockReportForTheDay2 = _repo.FindClientStocktReportForTheDay(jobVariant.SidProductId, job.JobName);

                // Update Issuance
                cardIssuance.TotalQuantityIssued -= cardIssuanceLog.QuantityIssued;
                cardIssuance.TotalQuantityRemain = 0;
                var t33 = await UpdateCardIssuance(cardIssuance.Id, cardIssuance);

                //create a new card issuance log
                // get all the issuance for the tracker, iterate to delete it
                var jobTrackerCardIssuanceLogs = _repo.FindIssuanceLogByTrackerId(jobTracker.Id);

                foreach (var jobIssuance in jobTrackerCardIssuanceLogs)
                {
                    jobIssuance.IsDeleted = true;
                    context.CardIssuanceLogs.Attach(jobIssuance);
                    context.Entry(jobIssuance).State = EntityState.Modified;
                }
                await context.SaveChangesAsync();

                //Todo: Remove as redundant code
                //var newCardIssuanceLog = new CardIssuanceLog()
                //{
                //    JobTrackerId = jobTracker.Id,
                //    CardIssuanceId = cardIssuanceLog.CardIssuanceId,
                //    IssuanceTypeId = cardIssuanceLog.IssuanceTypeId,
                //    TotalQuantity = job.Quantity,
                //    QuantityIssued = -(cardIssuanceLog.QuantityIssued),
                //    QuantityRemain = 0,
                //    IssuanceId = userId,
                //    CollectorId = cardIssuanceLog.CollectorId, //Todo: Change to Inventory users
                //    IssuedDate = DateTime.Now
                //};
                //var t4 = await CreateCardIssuanceLog(newCardIssuanceLog);

                // Stock Log
                //============
                // Update the Vault and StockReport
                var updateVault = clientVaultReport;
                updateVault.OpeningStock = updateVault.ClosingStock;
                updateVault.ClosingStock += cardIssuanceLog.QuantityIssued; //Add the return card
                var t0UpdateClientVault = await UpdateClientVaultReport(updateVault.Id, updateVault);

                // Update the Vault and StockReport
                var newClientStockLog = new ClientStockLog()
                {
                    ClientStockReportId = clientStockReportForTheDay2.Id,
                    CardIssuanceId = cardIssuance.Id,
                    IssuanceQty = cardIssuanceLog.QuantityIssued,
                    OpeningStock = updateVault.OpeningStock,
                    ClosingStock = updateVault.OpeningStock + cardIssuanceLog.QuantityIssued
                };
                await CreateClientStockLog(newClientStockLog);

                // ClientStockReport
                var updateDayStock = clientStockReportForTheDay2;
                updateDayStock.FileName = job.JobName;
                updateDayStock.OpeningStock = updateVault.OpeningStock;
                updateDayStock.ClosingStock = updateVault.OpeningStock + cardIssuanceLog.QuantityIssued;
                updateDayStock.ReturnQty += cardIssuanceLog.QuantityIssued;
                updateDayStock.CreatedOn = DateTime.Now;
                await UpdateClientStockReport(updateDayStock.Id, updateDayStock);

                #endregion

            }

            return Ok();
        }

        // Card Engr FirstCard Revert
        [HttpPost]
        [Route("firstcard/revert/{jobTrackerId:int}")]
        public async Task<IHttpActionResult> CardEngrFirstCardUnitRevert(int jobTrackerId)
        {
            var jobTracker = await context.JobTrackers.Include(a => a.Job).SingleOrDefaultAsync(j => j.Id == jobTrackerId);
            var serviceType = await context.ServiceTypes.FindAsync(jobTracker.Job.ServiceTypeId);
            var job = jobTracker.Job;
            var department = await context.Departments.Where(a => a.Name == "Card Engineer").SingleOrDefaultAsync();
            //var depart = await context.Departments.FindAsync(entity.DepartmentId);

            #region Definations
            var jobStatusPending = _repo.FindJobStatusByName("Pending");
            var jobStatusQueue = _repo.FindJobStatusByName("Queue");
            var jobStatusReverted = _repo.FindJobStatusByName("Reverted");

            var jobTypePersoOnly = _repo.FindJobTypeByName("Perso Only");
            var jobTypePrintingOnly = _repo.FindJobTypeByName("Printing Only");
            var jobTypeMailingOnly = _repo.FindJobTypeByName("Mailing Only");
            var jobTypeDispatchOnly = _repo.FindJobTypeByName("Dispatch Only");
            var jobTypePrintingAndPerso = _repo.FindJobTypeByName("Printing And Perso");
            var jobTypePrintingPersoAndMailing = _repo.FindJobTypeByName("Printing, Perso And Mailing");
            var jobTypePersoAndMailing = _repo.FindJobTypeByName("Perso And Mailing");

            #endregion

            //Update JobTracker
            #region JobTrackerSetup

            if (serviceType.Id == jobTypePersoOnly.Id)
            {
                #region PersoOnly
                jobTracker.FirstJobRunId = jobStatusQueue.Id;
                jobTracker.QAId = jobStatusPending.Id;
                jobTracker.ModifiedOn = DateTime.Now;
                #endregion
            }
            else if (serviceType.Id == jobTypePrintingAndPerso.Id)
            {
                #region PersoPrinting
                jobTracker.FirstJobRunId = jobStatusQueue.Id;
                jobTracker.QAId = jobStatusPending.Id;
                jobTracker.ModifiedOn = DateTime.Now;
                #endregion

            }
            else if (serviceType.Id == jobTypePersoAndMailing.Id)
            {
                #region PersoAndMailing
                jobTracker.FirstJobRunId = jobStatusQueue.Id;
                jobTracker.QAId = jobStatusPending.Id;
                jobTracker.ModifiedOn = DateTime.Now;
                #endregion
            }
            else if (serviceType.Id == jobTypePrintingPersoAndMailing.Id)
            {
                #region PersoAndMailing
                jobTracker.FirstJobRunId = jobStatusQueue.Id;
                jobTracker.QAId = jobStatusPending.Id;
                jobTracker.ModifiedOn = DateTime.Now;
                #endregion
            }

            jobTracker.JobStatusId = jobStatusPending.Id;
            context.JobTrackers.Attach(jobTracker);
            context.Entry(jobTracker).State = EntityState.Modified;
            await context.SaveChangesAsync();

            #endregion
            
            // Delete Sid03FirstCards
            var firstCard = await context.Sid03FirstCards.Where(a => a.JobTrackerId ==  jobTracker.Id).SingleOrDefaultAsync();
            context.Sid03FirstCards.Remove(firstCard);
            await context.SaveChangesAsync();

            var jobSplits = await context.JobSplits.Where(a => a.JobTrackerId == jobTracker.Id && a.DepartmentId == department.Id).ToListAsync();
            foreach (var jobSplit in jobSplits)
            {
                var sidQA = await context.Sid05QAs.Where(a => a.JobTrackerId == jobTracker.Id && a.JobSplitId == jobSplit.Id).ToListAsync();
                foreach (var qa in sidQA)
                {
                    context.Sid05QAs.Remove(qa);
                }

                var ceAnalysis = await context.JobSplitCEAnalysis.Where(a => a.JobTrackerId == jobTracker.Id && a.JobSplitId == jobSplit.Id).ToListAsync();
                foreach (var ce in ceAnalysis)
                {
                    context.JobSplitCEAnalysis.Remove(ce);
                }

                context.JobSplits.Remove(jobSplit);
                await context.SaveChangesAsync();
            }

            await context.SaveChangesAsync();

            return Ok();
        }

        [HttpPost]
        [Route("QAPerso/revert/{jobTrackerId:int}")]
        public async Task<IHttpActionResult> QACardUnitRevert(int jobTrackerId)
        {

            var jobTracker = await context.JobTrackers.Include(a => a.Job).SingleOrDefaultAsync(j => j.Id == jobTrackerId);
            var serviceType = await context.ServiceTypes.FindAsync(jobTracker.Job.ServiceTypeId);
            var department = await context.Departments.Where(a => a.Name == "Card Engineer").SingleOrDefaultAsync();

            var jobSplits = await context.JobSplits.Where(a => a.JobTrackerId == jobTracker.Id && a.DepartmentId == department.Id).ToListAsync();
            foreach (var j in jobSplits)
            {
                j.IsQACompleted = false;
                context.JobSplits.Attach(j);
                context.Entry(j).State = EntityState.Modified;
                await context.SaveChangesAsync();
            }

            #region Definations
            var jobStatusPending = _repo.FindJobStatusByName("Pending");
            var jobStatusQueue = _repo.FindJobStatusByName("Queue");
            var jobStatusReverted = _repo.FindJobStatusByName("Reverted");

            var jobTypePersoOnly = _repo.FindJobTypeByName("Perso Only");
            var jobTypePrintingOnly = _repo.FindJobTypeByName("Printing Only");
            var jobTypeMailingOnly = _repo.FindJobTypeByName("Mailing Only");
            var jobTypeDispatchOnly = _repo.FindJobTypeByName("Dispatch Only");
            var jobTypePrintingAndPerso = _repo.FindJobTypeByName("Printing And Perso");
            var jobTypePrintingPersoAndMailing = _repo.FindJobTypeByName("Printing, Perso And Mailing");
            var jobTypePersoAndMailing = _repo.FindJobTypeByName("Perso And Mailing");

            #endregion

            //Update JobTracker
            #region JobTrackerSetup

            if (serviceType.Id == jobTypePersoOnly.Id)
            {
                #region PersoOnly
                jobTracker.QAId = jobStatusQueue.Id;
                jobTracker.CardEngrResumeId = jobStatusPending.Id;
                jobTracker.ModifiedOn = DateTime.Now;
                #endregion
            }
            else if (serviceType.Id == jobTypePrintingAndPerso.Id)
            {
                #region PersoPrinting
                jobTracker.QAId = jobStatusQueue.Id;
                jobTracker.CardEngrResumeId = jobStatusPending.Id;
                jobTracker.ModifiedOn = DateTime.Now;
                #endregion

            }
            else if (serviceType.Id == jobTypePersoAndMailing.Id)
            {
                #region PersoAndMailing
                jobTracker.QAId = jobStatusQueue.Id;
                jobTracker.CardEngrResumeId = jobStatusPending.Id;
                jobTracker.ModifiedOn = DateTime.Now;
                #endregion
            }
            else if (serviceType.Id == jobTypePrintingPersoAndMailing.Id)
            {
                #region PersoAndMailing
                jobTracker.QAId = jobStatusQueue.Id;
                jobTracker.CardEngrResumeId = jobStatusPending.Id;
                jobTracker.ModifiedOn = DateTime.Now;
                #endregion
            }

            jobTracker.JobStatusId = jobStatusPending.Id;
            context.JobTrackers.Attach(jobTracker);
            context.Entry(jobTracker).State = EntityState.Modified;
            await context.SaveChangesAsync();

            #endregion


            return Ok();
        }

        [HttpPost]
        [Route("CEResumePerso/revert/{jobTrackerId:int}")]
        public async Task<IHttpActionResult> CEResumeCardUnitRevert(int jobTrackerId)
        {
            var jobTracker = await context.JobTrackers.Include(a => a.Job).SingleOrDefaultAsync(j => j.Id == jobTrackerId);
            var serviceType = await context.ServiceTypes.FindAsync(jobTracker.Job.ServiceTypeId);
            var department = await context.Departments.Where(a => a.Name == "Card Engineer").SingleOrDefaultAsync();

            #region Definations
            var jobStatusPending = _repo.FindJobStatusByName("Pending");
            var jobStatusQueue = _repo.FindJobStatusByName("Queue");
            var jobStatusReverted = _repo.FindJobStatusByName("Reverted");

            var jobTypePersoOnly = _repo.FindJobTypeByName("Perso Only");
            var jobTypePrintingOnly = _repo.FindJobTypeByName("Printing Only");
            var jobTypeMailingOnly = _repo.FindJobTypeByName("Mailing Only");
            var jobTypeDispatchOnly = _repo.FindJobTypeByName("Dispatch Only");
            var jobTypePrintingAndPerso = _repo.FindJobTypeByName("Printing And Perso");
            var jobTypePrintingPersoAndMailing = _repo.FindJobTypeByName("Printing, Perso And Mailing");
            var jobTypePersoAndMailing = _repo.FindJobTypeByName("Perso And Mailing");

            #endregion

            var jobSplits = await context.JobSplits.Where(a => a.JobTrackerId == jobTracker.Id && a.DepartmentId == department.Id).ToListAsync();

            foreach (var split in jobSplits)
            {
                var jobCE = await context.JobSplitCEAnalysis.Where(a => a.JobSplitId == split.Id).ToListAsync();
                foreach (var ce in jobCE)
                {
                    ce.IsJobHandleByCE = false;
                    context.JobSplitCEAnalysis.Attach(ce);
                    context.Entry(ce).State = EntityState.Modified;
                    await context.SaveChangesAsync();
                }

                // JobHandlers
                var jobHandlers = await context.JobHandlers.Where(a => a.JobSplitId == split.Id && a.Remark == "CE").ToListAsync();
                
                foreach (var job in jobHandlers)
                {
                    context.JobHandlers.Remove(job);
                }

                await context.SaveChangesAsync();
            }

            //Update JobTracker
            #region JobTrackerSetup

            if (serviceType.Id == jobTypePersoOnly.Id)
            {
                #region PersoOnly
                jobTracker.CardEngrResumeId = jobStatusQueue.Id;
                jobTracker.QCId = jobStatusPending.Id;
                jobTracker.ModifiedOn = DateTime.Now;
                #endregion
            }
            else if (serviceType.Id == jobTypePrintingAndPerso.Id)
            {
                #region PersoPrinting
                jobTracker.CardEngrResumeId = jobStatusQueue.Id;
                jobTracker.QCId = jobStatusPending.Id;
                jobTracker.ModifiedOn = DateTime.Now;
                #endregion

            }
            else if (serviceType.Id == jobTypePersoAndMailing.Id)
            {
                #region PersoAndMailing
                jobTracker.CardEngrResumeId = jobStatusQueue.Id;
                jobTracker.QCId = jobStatusPending.Id;
                jobTracker.ModifiedOn = DateTime.Now;
                #endregion
            }
            else if (serviceType.Id == jobTypePrintingPersoAndMailing.Id)
            {
                #region PersoAndMailing
                jobTracker.CardEngrResumeId = jobStatusQueue.Id;
                jobTracker.QCId = jobStatusPending.Id;
                jobTracker.ModifiedOn = DateTime.Now;
                #endregion
            }

            jobTracker.JobStatusId = jobStatusPending.Id;
            context.JobTrackers.Attach(jobTracker);
            context.Entry(jobTracker).State = EntityState.Modified;
            await context.SaveChangesAsync();

            #endregion

            return Ok();
        }

        [HttpPost]
        [Route("QCPerso/revert/{jobTrackerId:int}")]
        public async Task<IHttpActionResult> QCCardUnitRevert(int jobTrackerId)
        {
            var jobTracker = await context.JobTrackers.Include(a => a.Job).SingleOrDefaultAsync(j => j.Id == jobTrackerId);
            var serviceType = await context.ServiceTypes.FindAsync(jobTracker.Job.ServiceTypeId);
            var department = await context.Departments.Where(a => a.Name == "Card Engineer").SingleOrDefaultAsync();

            #region Definations
            var jobStatusPending = _repo.FindJobStatusByName("Pending");
            var jobStatusQueue = _repo.FindJobStatusByName("Queue");
            var jobStatusReverted = _repo.FindJobStatusByName("Reverted");
            var jobStatusNotRequired = _repo.FindJobStatusByName("Not Required");

            var jobTypePersoOnly = _repo.FindJobTypeByName("Perso Only");
            var jobTypePrintingOnly = _repo.FindJobTypeByName("Printing Only");
            var jobTypeMailingOnly = _repo.FindJobTypeByName("Mailing Only");
            var jobTypeDispatchOnly = _repo.FindJobTypeByName("Dispatch Only");
            var jobTypePrintingAndPerso = _repo.FindJobTypeByName("Printing And Perso");
            var jobTypePrintingPersoAndMailing = _repo.FindJobTypeByName("Printing, Perso And Mailing");
            var jobTypePersoAndMailing = _repo.FindJobTypeByName("Perso And Mailing");

            #endregion
            
            var jobSplits = await context.JobSplits.Where(a => a.JobTrackerId == jobTracker.Id && a.DepartmentId == department.Id).ToListAsync();

            foreach (var split in jobSplits)
            {
                var jobCE = await context.JobSplitCEAnalysis.Where(a => a.JobSplitId == split.Id).ToListAsync();
                foreach (var ce in jobCE)
                {
                    ce.IsQCInitialized = false;
                    ce.IsJobHandleByQC = false;

                    context.JobSplitCEAnalysis.Attach(ce);
                    context.Entry(ce).State = EntityState.Modified;
                    await context.SaveChangesAsync();
                }

                // JobHandlers
                var jobHandlers = await context.JobHandlers.Where(a => a.JobSplitId == split.Id && a.Remark == "QC").ToListAsync();

                foreach (var job in jobHandlers)
                {
                    context.JobHandlers.Remove(job);
                }

                await context.SaveChangesAsync();
            }
            
            //Update JobTracker
            #region JobTrackerSetup

            if (serviceType.Id == jobTypePersoOnly.Id)
            {
                #region PersoOnly
                jobTracker.QCId = jobStatusQueue.Id;
                jobTracker.MailingId = jobStatusNotRequired.Id;
                jobTracker.DispatchId = jobStatusPending.Id;
                jobTracker.ModifiedOn = DateTime.Now;
                #endregion
            }
            else if (serviceType.Id == jobTypePrintingAndPerso.Id)
            {
                #region PersoPrinting
                jobTracker.QCId = jobStatusQueue.Id;
                jobTracker.MailingId = jobStatusNotRequired.Id;
                jobTracker.DispatchId = jobStatusPending.Id;
                jobTracker.ModifiedOn = DateTime.Now;
                #endregion

            }
            else if (serviceType.Id == jobTypePersoAndMailing.Id)
            {
                #region PersoAndMailing
                jobTracker.QCId = jobStatusQueue.Id;
                jobTracker.MailingId = jobStatusPending.Id;
                jobTracker.DispatchId = jobStatusPending.Id;
                jobTracker.ModifiedOn = DateTime.Now;
                #endregion
            }
            else if (serviceType.Id == jobTypePrintingPersoAndMailing.Id)
            {
                #region PersoAndMailing
                jobTracker.QCId = jobStatusQueue.Id;
                jobTracker.MailingId = jobStatusPending.Id;
                jobTracker.DispatchId = jobStatusPending.Id;
                jobTracker.ModifiedOn = DateTime.Now;
                #endregion
            }

            jobTracker.JobStatusId = jobStatusPending.Id;
            context.JobTrackers.Attach(jobTracker);
            context.Entry(jobTracker).State = EntityState.Modified;
            await context.SaveChangesAsync();

            #endregion

            return Ok();
        }


        [HttpPost]
        [Route("DPPerso/revert/{jobTrackerId:int}")]
        public async Task<IHttpActionResult> DPCardUnitRevert(int jobTrackerId)
        {
            var jobTracker = await context.JobTrackers.Include(a => a.Job).SingleOrDefaultAsync(j => j.Id == jobTrackerId);
            var serviceType = await context.ServiceTypes.FindAsync(jobTracker.Job.ServiceTypeId);
            var department = await context.Departments.Where(a => a.Name == "Dispatch").SingleOrDefaultAsync();
            
            #region Definations
            var jobStatusPending = _repo.FindJobStatusByName("Pending");
            var jobStatusQueue = _repo.FindJobStatusByName("Queue");
            var jobStatusReverted = _repo.FindJobStatusByName("Reverted");
            var jobStatusNotRequired = _repo.FindJobStatusByName("Not Required");
            var jobStatusWIP = _repo.FindJobStatusByName("WIP");

            var jobTypePersoOnly = _repo.FindJobTypeByName("Perso Only");
            var jobTypePrintingOnly = _repo.FindJobTypeByName("Printing Only");
            var jobTypeMailingOnly = _repo.FindJobTypeByName("Mailing Only");
            var jobTypeDispatchOnly = _repo.FindJobTypeByName("Dispatch Only");
            var jobTypePrintingAndPerso = _repo.FindJobTypeByName("Printing And Perso");
            var jobTypePrintingPersoAndMailing = _repo.FindJobTypeByName("Printing, Perso And Mailing");
            var jobTypePersoAndMailing = _repo.FindJobTypeByName("Perso And Mailing");

            #endregion

            var dispatch = await context.DispatchDelivery.Where(a => a.JobTrackerId == jobTracker.Id && a.IsNoteGenerated == false).ToListAsync();
            
            foreach(var a in dispatch)
            {
                var jobRange = (a.RangeTo - a.RangeFrom) + 1;

                //Card Delivery
                var cardDelivery  = await context.CardDelivery.Where(b=> b.JobTrackerId == jobTracker.Id && b.TargetDepartmentId == department.Id).SingleOrDefaultAsync();

                cardDelivery.TotalQuantity -= jobRange;
                context.CardDelivery.Attach(cardDelivery);
                context.Entry(cardDelivery).State = EntityState.Modified;
                await context.SaveChangesAsync();

                // Revert DeliveryLog
                var cardDeliveryLog = await context.CardDeliveryLogs.Where(c => c.CardDeliveryId == cardDelivery.Id).ToListAsync();

                foreach(var log in cardDeliveryLog)
                {
                    log.IsConfirmed = false;

                    context.CardDeliveryLogs.Attach(log);
                    context.Entry(log).State = EntityState.Modified;
                    await context.SaveChangesAsync();
                }


                ////////////////////////////
                int dispatchQueue = 0;

                if (cardDelivery.TotalQuantity == 0)
                {
                    // Do a requeue
                    dispatchQueue = jobStatusQueue.Id;
                }
                else if (cardDelivery.TotalQuantity < jobTracker.Job.Quantity)
                {
                    // Do WIP
                    dispatchQueue = jobStatusWIP.Id;
                }
                
                // Update JobTracker

                #region JobTrackerSetup

                if (serviceType.Id == jobTypePersoOnly.Id)
                {
                    #region PersoOnly
                    jobTracker.DispatchId = dispatchQueue;
                    jobTracker.MAudId = jobStatusPending.Id;
                    jobTracker.ModifiedOn = DateTime.Now;
                    #endregion
                }
                else if (serviceType.Id == jobTypePrintingOnly.Id)
                {
                    #region PrintOnly
                    jobTracker.DispatchId = dispatchQueue;
                    jobTracker.MAudId = jobStatusPending.Id;
                    jobTracker.ModifiedOn = DateTime.Now;
                    #endregion
                }
                else if (serviceType.Id == jobTypeMailingOnly.Id)
                {
                    #region MailingOnly
                    jobTracker.DispatchId = dispatchQueue;
                    jobTracker.MAudId = jobStatusPending.Id;
                    jobTracker.ModifiedOn = DateTime.Now;
                    #endregion
                }
                else if (serviceType.Id == jobTypeDispatchOnly.Id)
                {
                    #region DispatchOnly
                    jobTracker.DispatchId = dispatchQueue;
                    jobTracker.MAudId = jobStatusPending.Id;
                    jobTracker.ModifiedOn = DateTime.Now;
                    #endregion
                }
                else if (serviceType.Id == jobTypePrintingAndPerso.Id)
                {
                    #region PersoPrinting
                    jobTracker.DispatchId = dispatchQueue;
                    jobTracker.MAudId = jobStatusPending.Id;
                    jobTracker.ModifiedOn = DateTime.Now;
                    #endregion

                }
                else if (serviceType.Id == jobTypePersoAndMailing.Id)
                {
                    #region PersoAndMailing
                    jobTracker.DispatchId = dispatchQueue;
                    jobTracker.MAudId = jobStatusPending.Id;
                    jobTracker.ModifiedOn = DateTime.Now;
                    #endregion

                }
                else if (serviceType.Id == jobTypePrintingPersoAndMailing.Id)
                {
                    #region PersoAndMailing
                    jobTracker.DispatchId = dispatchQueue;
                    jobTracker.MAudId = jobStatusPending.Id;
                    jobTracker.ModifiedOn = DateTime.Now;

                    #endregion
                }

                jobTracker.JobStatusId = jobStatusPending.Id;
                context.JobTrackers.Attach(jobTracker);
                context.Entry(jobTracker).State = EntityState.Modified;
                await context.SaveChangesAsync();

                #endregion
                
                // Deduct CardDelivery for Dispatch Unit deduct the Quantity
                a.IsNoteGenerated = false;
                context.DispatchDelivery.Attach(a);
                context.Entry(a).State = EntityState.Modified;
                await context.SaveChangesAsync();

            }

            return Ok();
        }


        public async Task<IHttpActionResult> CreateClientStockReport(ClientStockReport entity)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            context.ClientStockReports.Add(entity);
            await context.SaveChangesAsync();

            return Ok<ClientStockReport>(entity);
        }

        public async Task<IHttpActionResult> CreateCardIssuanceLog(CardIssuanceLog entity)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            context.CardIssuanceLogs.Add(entity);
            await context.SaveChangesAsync();

            return Ok<CardIssuanceLog>(entity);
        }

        public async Task<IHttpActionResult> UpdateCardIssuance(int id, CardIssuance entity)
        {
            var existingEntity = await context.CardIssuances.FindAsync(entity.Id);

            if (id != entity.Id) { return BadRequest(ModelState); }
            if (existingEntity != null && context.Entry(existingEntity).State != EntityState.Detached)
            {
                context.Entry(existingEntity).State = EntityState.Detached;
            }

            context.CardIssuances.Attach(entity);
            context.Entry(entity).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok<CardIssuance>(entity);
        }

        public async Task<IHttpActionResult> UpdateClientVaultReport(int id, ClientVaultReport entity)
        {
            var existingEntity = await context.ClientVaultReports.FindAsync(entity.Id);

            if (id != entity.Id) { return BadRequest(ModelState); }

            if (existingEntity != null && context.Entry(existingEntity).State != EntityState.Detached)
            {
                context.Entry(existingEntity).State = EntityState.Detached;
            }

            var local = context.Set<ClientVaultReport>().Local.FirstOrDefault(f => f.Id == entity.Id);
            if (local != null) { context.Entry(local).State = EntityState.Detached; }

            entity.ModifiedOn = DateTime.Now;
            context.ClientVaultReports.Attach(entity);
            context.Entry(entity).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok<ClientVaultReport>(entity);

        }

        public async Task<IHttpActionResult> CreateClientStockLog(ClientStockLog entity)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            context.ClientStockLogs.Add(entity);
            await context.SaveChangesAsync();

            return Ok<ClientStockLog>(entity);
        }
        
        public async Task<IHttpActionResult> UpdateClientStockReport(int id, ClientStockReport entity)
        {
            var existingEntity = await context.ClientStockReports.FindAsync(entity.Id);

            if (id != entity.Id) { return BadRequest(ModelState); }

            if (existingEntity != null && context.Entry(existingEntity).State != EntityState.Detached)
            {
                context.Entry(existingEntity).State = EntityState.Detached;
            }

            var local = context.Set<ClientStockReport>().Local.FirstOrDefault(f => f.Id == entity.Id);
            if (local != null) { context.Entry(local).State = EntityState.Detached; }

            context.ClientStockReports.Attach(entity);
            context.Entry(entity).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok<ClientStockReport>(entity);

        }



    }
}
