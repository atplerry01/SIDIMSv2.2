using AuthorizationServer.Api.Infrastructure;
using AuthorizationServer.Api.Models;
using Microsoft.AspNet.Identity;
using SID.Common.Model.Lookups;
using SID.Common.Model.Production;
using System;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;

namespace AuthorizationServer.Api.Controllers
{
    [Authorize]
    [RoutePrefix("api/co")]
    public class CardOperationsController : ApiController
    {
        ApplicationDbContext context = new ApplicationDbContext();
        private ApplicationRepository _repo = null;
        readonly SidimBreezeRepository _repository = new SidimBreezeRepository();

        public CardOperationsController()
        {
            _repo = new ApplicationRepository();
        }

        [Route("job/create")]
        public async Task<IHttpActionResult> CreateJob([FromBody] JobModel entity) //Todo: Create the model for this entity
        {
            //Todo: check if the job already exist

            if (entity == null)
            {
                return BadRequest(ModelState);
            }

            if (entity.RemarkId == 0)
            {
                var remark = context.Remarks.FirstOrDefault(a => a.Name == "Null");
                entity.RemarkId = remark.Id;
            }

            
            // Get Required Resources
            var jobTypePersoOnly = _repo.FindJobTypeByName("Perso Only");
            var jobTypePrintingOnly = _repo.FindJobTypeByName("Printing Only");
            var jobTypeMailingOnly = _repo.FindJobTypeByName("Mailing Only");
            var jobTypeDispatchOnly = _repo.FindJobTypeByName("Dispatch Only");
            var jobTypePrintingAndPerso = _repo.FindJobTypeByName("Printing And Perso");
            var jobTypePrintingPersoAndMailing = _repo.FindJobTypeByName("Printing, Perso And Mailing");
            var jobTypePersoAndMailing = _repo.FindJobTypeByName("Perso And Mailing");

            var jobName = _repo.FindServerJobByName(entity.JobName);
            var jobStatusPending = _repo.FindJobStatusByName("Pending");
            var jobStatusCompleted = _repo.FindJobStatusByName("Completed");
            var jobStatusQueue = _repo.FindJobStatusByName("Queue");
            var jobStatusNotRequired = _repo.FindJobStatusByName("Not Required");

            //var jobTrackerStatusNew = _repo.FindJobTrackerStatusByName("New");

            if (entity.JobType == "NonPerso")
            {
                NonPersoJob nonPersoJob = await _repo.FindNonPersoJobById(entity.Id);
                nonPersoJob.IsTreated = true;
                context.Entry(nonPersoJob).State = EntityState.Modified;
                await context.SaveChangesAsync();
            }
            else
            {
                ServerJobQueue serverJobQueue = await _repo.FindServerJobQueueById(jobName.Id);

                // Update ServerJob as Treated
                serverJobQueue.IsTreated = true;
                context.Entry(serverJobQueue).State = EntityState.Modified;
                await context.SaveChangesAsync();
            }

            var newJob = new Job()
            {
                JobName = entity.JobName,
                SidCardTypeId = entity.SidCardTypeId,
                SidClientId = entity.SidClientId,
                RemarkId = entity.RemarkId,
                Quantity = entity.Quantity,
                CreatedOn = DateTime.Now,
                ModifiedOn = DateTime.Now,
                JobStatusId = jobStatusPending.Id
            };

            // Create Job
            //newJob.JobStatusId = jobStatusPending.Id;
            context.Jobs.Add(newJob);
            await context.SaveChangesAsync();

            var lastCreatedJob = _repository.Jobs.Where(m => m.JobName == entity.JobName).OrderByDescending(p => p.Id).ToList().FirstOrDefault();

            // Create JobTracker
            var jobTrackerPersoOnly = new JobTracker()
            {
                JobId = lastCreatedJob.Id,
                CardOpsId = jobStatusCompleted.Id,
                InventoryId = jobStatusQueue.Id,
                PrintingId = jobStatusNotRequired.Id,
                PrintQAId = jobStatusPending.Id,
                PrintQCId = jobStatusPending.Id,
                CardEngrId = jobStatusPending.Id,
                QAId = jobStatusPending.Id,
                FirstJobRunId = jobStatusPending.Id,
                CardEngrResumeId = jobStatusPending.Id,
                QCId = jobStatusPending.Id,
                MailingId = jobStatusPending.Id,
                DispatchId = jobStatusPending.Id, //Create dispatch setups
                CustomerServiceId = jobStatusPending.Id,
                MAudId = jobStatusPending.Id,

                JobStatusId = jobStatusPending.Id,
                CreatedOn = DateTime.Now,
                ModifiedOn = DateTime.Now
            };

            context.JobTrackers.Add(jobTrackerPersoOnly);
            await context.SaveChangesAsync();

            // CardOpsLogs
            entity.Id = lastCreatedJob.Id;
            var t1 = CreateCardOpsLogs(newJob);
            await Task.WhenAll(t1);

            return Ok<Job>(newJob);

        }

        public async Task<IHttpActionResult> CreateCardOpsLogs(Job entity)
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

        public async Task<IHttpActionResult> CreateJobSetups(Job entity)
        {
            context.Jobs.Add(entity);
            await context.SaveChangesAsync();
            return Ok<Job>(entity);
        }

        public async Task<IHttpActionResult> CreateJobTrackers(JobTracker entity)
        {
            context.JobTrackers.Add(entity);
            await context.SaveChangesAsync();
            return Ok<JobTracker>(entity);
        }

        [HttpPut]
        [Route("job/update/{id:int}")]
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

            var jobStatusPending = _repo.FindJobStatusByName("Pending");
            entity.JobStatusId = jobStatusPending.Id;

            context.Jobs.Attach(entity);
            context.Entry(entity).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok<Job>(entity);

        }

        [HttpPut]
        [Route("serverjob/update/{id:int}")]
        public async Task<IHttpActionResult> UpdateServerJob(int id, ServerJobQueue entity)
        {
            var existingEntity = await context.ServerJobQueues.FindAsync(entity.Id);

            if (id != entity.Id) { return BadRequest(ModelState); }

            if (existingEntity != null && context.Entry(existingEntity).State != EntityState.Detached)
            {
                context.Entry(existingEntity).State = EntityState.Detached;
            }

            var local = context.Set<ServerJobQueue>().Local.FirstOrDefault(f => f.Id == entity.Id);
            if (local != null) { context.Entry(local).State = EntityState.Detached; }

            context.ServerJobQueues.Attach(entity);
            context.Entry(entity).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok<ServerJobQueue>(entity);

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


        [HttpPut]
        [Route("serverjob/delete/{id:int}")]
        public async Task<IHttpActionResult> MarkDeleteServerJob(int id, ServerJobQueue entity)
        {
            var existingEntity = await context.ServerJobQueues.FindAsync(entity.Id);

            if (id != entity.Id) { return BadRequest(ModelState); }

            if (existingEntity != null && context.Entry(existingEntity).State != EntityState.Detached)
            {
                context.Entry(existingEntity).State = EntityState.Detached;
            }

            var local = context.Set<ServerJobQueue>().Local.FirstOrDefault(f => f.Id == entity.Id);
            if (local != null) { context.Entry(local).State = EntityState.Detached; }

            //existingEntity.IsTreated = true;
            existingEntity.IsDeleted = true;
            existingEntity.ModifiedOn = DateTime.Now;

            context.ServerJobQueues.Attach(existingEntity);
            context.Entry(existingEntity).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok<ServerJobQueue>(entity);

        }

        [HttpPut]
        [Route("serverjob/undelete/{id:int}")]
        public async Task<IHttpActionResult> MarkUnDeleteServerJob(int id, ServerJobQueue entity)
        {
            var existingEntity = await context.ServerJobQueues.FindAsync(entity.Id);

            if (id != entity.Id) { return BadRequest(ModelState); }

            if (existingEntity != null && context.Entry(existingEntity).State != EntityState.Detached)
            {
                context.Entry(existingEntity).State = EntityState.Detached;
            }

            var local = context.Set<ServerJobQueue>().Local.FirstOrDefault(f => f.Id == entity.Id);
            if (local != null) { context.Entry(local).State = EntityState.Detached; }

            //existingEntity.IsTreated = true;
            existingEntity.IsDeleted = false;
            existingEntity.ModifiedOn = DateTime.Now;

            context.ServerJobQueues.Attach(existingEntity);
            context.Entry(existingEntity).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok<ServerJobQueue>(entity);

        }


        //CardType
        [Route("dictionary/cardtype/create")]
        public async Task<IHttpActionResult> CreateDictionaryCardType(DictionaryCardType entity)
        {
            string userId = User.Identity.GetUserId();

            var newEntity = new DictionaryCardType()
            {
                SidCardTypeId = entity.SidCardTypeId,
                CardCodeName = entity.CardCodeName
            };

            context.DictionaryCardTypes.Add(newEntity);
            await context.SaveChangesAsync();

            return Ok<DictionaryCardType>(newEntity);
        }

        [HttpPut]
        [Route("dictionary/cardtype/update/{id:int}")]
        public async Task<IHttpActionResult> UpdateDictionaryCardType(int id, DictionaryCardType entity)
        {
            var existingEntity = await context.DictionaryCardTypes.FindAsync(entity.Id);

            if (id != entity.Id) { return BadRequest(ModelState); }

            if (existingEntity != null && context.Entry(existingEntity).State != EntityState.Detached)
            {
                context.Entry(existingEntity).State = EntityState.Detached;
            }
            var local = context.Set<DictionaryCardType>().Local.FirstOrDefault(f => f.Id == entity.Id);
            if (local != null) { context.Entry(local).State = EntityState.Detached; }

            context.DictionaryCardTypes.Attach(entity);
            context.Entry(entity).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok<DictionaryCardType>(entity);

        }

        //ClientName
        [Route("dictionary/clientname/create")]
        public async Task<IHttpActionResult> CreateDictionaryClientNames(DictionaryClientName entity)
        {
            string userId = User.Identity.GetUserId();

            var newEntity = new DictionaryClientName()
            {
                SidClientId = entity.SidClientId,
                ClientCodeName = entity.ClientCodeName
            };

            context.DictionaryClientNames.Add(newEntity);
            await context.SaveChangesAsync();

            return Ok<DictionaryClientName>(newEntity);
        }

        [HttpPut]
        [Route("dictionary/clientname/update/{id:int}")]
        public async Task<IHttpActionResult> UpdateDictionaryClientNames(int id, DictionaryClientName entity)
        {
            var existingEntity = await context.DictionaryClientNames.FindAsync(entity.Id);

            if (id != entity.Id) { return BadRequest(ModelState); }

            if (existingEntity != null && context.Entry(existingEntity).State != EntityState.Detached)
            {
                context.Entry(existingEntity).State = EntityState.Detached;
            }
            var local = context.Set<DictionaryClientName>().Local.FirstOrDefault(f => f.Id == entity.Id);
            if (local != null) { context.Entry(local).State = EntityState.Detached; }

            context.DictionaryClientNames.Attach(entity);
            context.Entry(entity).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok<DictionaryClientName>(entity);

        }

        //ServiceType
        [Route("dictionary/servicetype/create")]
        public async Task<IHttpActionResult> CreateDictionaryServiceType(DictionaryServiceType entity)
        {
            string userId = User.Identity.GetUserId();

            var newEntity = new DictionaryServiceType()
            {
                SidClientId = entity.SidClientId,
                SidCardTypeId = entity.SidCardTypeId,
                ServiceTypeId = entity.ServiceTypeId,
                ServiceCodeName = entity.ServiceCodeName
            };

            context.DictionaryServiceTypes.Add(newEntity);
            await context.SaveChangesAsync();

            return Ok<DictionaryServiceType>(newEntity);
        }

        [HttpPut]
        [Route("dictionary/servicetype/update/{id:int}")]
        public async Task<IHttpActionResult> UpdateDictionaryServiceType(int id, DictionaryServiceType entity)
        {
            var existingEntity = await context.DictionaryServiceTypes.FindAsync(entity.Id);

            if (id != entity.Id) { return BadRequest(ModelState); }

            if (existingEntity != null && context.Entry(existingEntity).State != EntityState.Detached)
            {
                context.Entry(existingEntity).State = EntityState.Detached;
            }
            var local = context.Set<DictionaryServiceType>().Local.FirstOrDefault(f => f.Id == entity.Id);
            if (local != null) { context.Entry(local).State = EntityState.Detached; }

            context.DictionaryServiceTypes.Attach(entity);
            context.Entry(entity).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok<DictionaryServiceType>(entity);

        }


        //JobId and ServiceType
        //// ServiceType Update

        // Check if Inventory have issue that card
        /// if no = directly update the service type
        /// if yes = revert all actions and recreate the process

        [HttpPut]
        [Route("dictionary/servicetype/update/{id:int}")]
        public async Task<IHttpActionResult> UpdateServiceType(int id, ServiceTypeModel entity)
        {

            var jobStatusPending = _repo.FindJobStatusByName("Pending");
            var jobStatusCompleted = _repo.FindJobStatusByName("Completed");
            var jobStatusQueue = _repo.FindJobStatusByName("Queue");
            var jobStatusNotRequired = _repo.FindJobStatusByName("Not Required");

            var existingEntity = await context.JobTrackers.FindAsync(entity.JobTrackerId);

            if (existingEntity.InventoryId == jobStatusQueue.Id)
            {
                //directly update the service type

            }
            else
            {
                //revert all actions and recreate the process
            }

            // Update the Tracker
            //if (existingEntity != null && context.Entry(existingEntity).State != EntityState.Detached)
            //{
            //    context.Entry(existingEntity).State = EntityState.Detached;
            //}

            //var local = context.Set<JobTracker>().Local.FirstOrDefault(f => f.Id == entity.JobTrackerId);
            //if (local != null) { context.Entry(local).State = EntityState.Detached; }

            // Get Required Resources
            var jobTypePersoOnly = _repo.FindJobTypeByName("Perso Only");
            var jobTypePrintingOnly = _repo.FindJobTypeByName("Printing Only");
            var jobTypeMailingOnly = _repo.FindJobTypeByName("Mailing Only");
            var jobTypeDispatchOnly = _repo.FindJobTypeByName("Dispatch Only");
            var jobTypePrintingAndPerso = _repo.FindJobTypeByName("Printing And Perso");
            var jobTypePrintingPersoAndMailing = _repo.FindJobTypeByName("Printing, Perso And Mailing");
            var jobTypePersoAndMailing = _repo.FindJobTypeByName("Perso And Mailing");

            var updatedTracker = existingEntity;

            // Reset JobTracker Setups
            #region JobTrackerSetup

            if (entity.ServiceTypeId == jobTypePersoOnly.Id)
            {
                #region PersoOnly

                updatedTracker.CardOpsId = jobStatusCompleted.Id;
                updatedTracker.InventoryId = jobStatusQueue.Id;
                updatedTracker.PrintingId = jobStatusNotRequired.Id;
                updatedTracker.PrintQAId = jobStatusNotRequired.Id;
                updatedTracker.PrintQCId = jobStatusNotRequired.Id;
                updatedTracker.CardEngrId = jobStatusQueue.Id;
                updatedTracker.QAId = jobStatusPending.Id;
                updatedTracker.FirstJobRunId = jobStatusQueue.Id;
                updatedTracker.CardEngrResumeId = jobStatusPending.Id;
                updatedTracker.QCId = jobStatusPending.Id;
                updatedTracker.MailingId = jobStatusNotRequired.Id;
                updatedTracker.DispatchId = jobStatusPending.Id; //Create dispatch setups
                updatedTracker.CustomerServiceId = jobStatusPending.Id;
                updatedTracker.MAudId = jobStatusPending.Id;
                updatedTracker.ModifiedOn = DateTime.Now;
                #endregion

            }
            else if (entity.ServiceTypeId == jobTypePrintingOnly.Id)
            {
                #region PrintOnly
                updatedTracker.CardOpsId = jobStatusCompleted.Id;
                updatedTracker.InventoryId = jobStatusQueue.Id;
                updatedTracker.PrintingId = jobStatusQueue.Id;
                updatedTracker.PrintQAId = jobStatusPending.Id;
                updatedTracker.PrintQCId = jobStatusPending.Id;
                updatedTracker.CardEngrId = jobStatusNotRequired.Id;
                updatedTracker.QAId = jobStatusNotRequired.Id;
                updatedTracker.FirstJobRunId = jobStatusNotRequired.Id;
                updatedTracker.CardEngrResumeId = jobStatusNotRequired.Id;
                updatedTracker.QCId = jobStatusNotRequired.Id;
                updatedTracker.MailingId = jobStatusNotRequired.Id;
                updatedTracker.DispatchId = jobStatusPending.Id; //Create dispatch setups
                updatedTracker.MAudId = jobStatusPending.Id;
                updatedTracker.CustomerServiceId = jobStatusPending.Id;
                updatedTracker.ModifiedOn = DateTime.Now;
                #endregion
            }
            else if (entity.ServiceTypeId == jobTypeMailingOnly.Id)
            {
                #region MailingOnly

                updatedTracker.CardOpsId = jobStatusCompleted.Id;
                updatedTracker.InventoryId = jobStatusQueue.Id;
                updatedTracker.PrintingId = jobStatusNotRequired.Id;
                updatedTracker.PrintQAId = jobStatusNotRequired.Id;
                updatedTracker.PrintQCId = jobStatusNotRequired.Id;
                updatedTracker.CardEngrId = jobStatusNotRequired.Id;
                updatedTracker.QAId = jobStatusNotRequired.Id;
                updatedTracker.FirstJobRunId = jobStatusNotRequired.Id;
                updatedTracker.CardEngrResumeId = jobStatusNotRequired.Id;
                updatedTracker.QCId = jobStatusNotRequired.Id;
                updatedTracker.MailingId = jobStatusQueue.Id;
                updatedTracker.DispatchId = jobStatusPending.Id; //Create dispatch setups
                updatedTracker.MAudId = jobStatusPending.Id;
                updatedTracker.CustomerServiceId = jobStatusPending.Id;
                updatedTracker.ModifiedOn = DateTime.Now;

                //context.JobTrackers.Add(jobTrackerMailingOnly);
                //await context.SaveChangesAsync();
                #endregion
            }
            else if (entity.ServiceTypeId == jobTypeDispatchOnly.Id)
            {
                #region DispatchOnly

                updatedTracker.CardOpsId = jobStatusCompleted.Id;
                updatedTracker.InventoryId = jobStatusQueue.Id;
                updatedTracker.PrintingId = jobStatusNotRequired.Id;
                updatedTracker.PrintQAId = jobStatusNotRequired.Id;
                updatedTracker.PrintQCId = jobStatusNotRequired.Id;
                updatedTracker.CardEngrId = jobStatusNotRequired.Id;
                updatedTracker.QAId = jobStatusNotRequired.Id;
                updatedTracker.FirstJobRunId = jobStatusNotRequired.Id;
                updatedTracker.CardEngrResumeId = jobStatusNotRequired.Id;
                updatedTracker.QCId = jobStatusNotRequired.Id;
                updatedTracker.MailingId = jobStatusNotRequired.Id;
                updatedTracker.DispatchId = jobStatusQueue.Id; //Create dispatch setups
                updatedTracker.MAudId = jobStatusPending.Id;
                updatedTracker.CustomerServiceId = jobStatusPending.Id;
                updatedTracker.ModifiedOn = DateTime.Now;

                //context.JobTrackers.Add(jobTrackerMailingOnly);
                //await context.SaveChangesAsync();
                #endregion
            }
            else if (entity.ServiceTypeId == jobTypePrintingAndPerso.Id)
            {
                #region PersoPrinting

                updatedTracker.CardOpsId = jobStatusCompleted.Id;
                updatedTracker.InventoryId = jobStatusQueue.Id;
                updatedTracker.PrintingId = jobStatusQueue.Id;
                updatedTracker.PrintQAId = jobStatusPending.Id;
                updatedTracker.PrintQCId = jobStatusPending.Id;
                updatedTracker.CardEngrId = jobStatusPending.Id;
                updatedTracker.QAId = jobStatusPending.Id;
                updatedTracker.FirstJobRunId = jobStatusPending.Id;
                updatedTracker.CardEngrResumeId = jobStatusPending.Id;
                updatedTracker.QCId = jobStatusPending.Id;
                updatedTracker.MailingId = jobStatusNotRequired.Id;
                updatedTracker.DispatchId = jobStatusPending.Id; //Create dispatch setups
                updatedTracker.MAudId = jobStatusPending.Id;
                updatedTracker.CustomerServiceId = jobStatusPending.Id;
                updatedTracker.ModifiedOn = DateTime.Now;

                //context.JobTrackers.Add(jobTrackerPersoPrinting);
                //await context.SaveChangesAsync();
                #endregion

            }
            else if (entity.ServiceTypeId == jobTypePersoAndMailing.Id)
            {
                #region PersoAndMailing

                updatedTracker.CardOpsId = jobStatusCompleted.Id;
                updatedTracker.InventoryId = jobStatusQueue.Id;
                updatedTracker.PrintingId = jobStatusNotRequired.Id;
                updatedTracker.PrintQAId = jobStatusNotRequired.Id;
                updatedTracker.PrintQCId = jobStatusNotRequired.Id;
                updatedTracker.CardEngrId = jobStatusQueue.Id;
                updatedTracker.QAId = jobStatusPending.Id;
                updatedTracker.FirstJobRunId = jobStatusQueue.Id;
                updatedTracker.CardEngrResumeId = jobStatusPending.Id;
                updatedTracker.QCId = jobStatusPending.Id;
                updatedTracker.MailingId = jobStatusPending.Id;
                updatedTracker.DispatchId = jobStatusPending.Id;
                updatedTracker.MAudId = jobStatusPending.Id;
                updatedTracker.CustomerServiceId = jobStatusPending.Id;
                updatedTracker.ModifiedOn = DateTime.Now;

                //context.JobTrackers.Add(jobTrackerPersoOnly);
                //await context.SaveChangesAsync();
                #endregion

            }
            else if (entity.ServiceTypeId == jobTypePrintingPersoAndMailing.Id)
            {
                #region PersoAndMailing

                updatedTracker.CardOpsId = jobStatusCompleted.Id;
                updatedTracker.InventoryId = jobStatusQueue.Id;
                updatedTracker.PrintingId = jobStatusQueue.Id;
                updatedTracker.PrintQAId = jobStatusPending.Id;
                updatedTracker.PrintQCId = jobStatusPending.Id;
                updatedTracker.CardEngrId = jobStatusPending.Id;
                updatedTracker.QAId = jobStatusPending.Id;
                updatedTracker.FirstJobRunId = jobStatusPending.Id;
                updatedTracker.CardEngrResumeId = jobStatusPending.Id;
                updatedTracker.QCId = jobStatusPending.Id;
                updatedTracker.MailingId = jobStatusPending.Id;
                updatedTracker.DispatchId = jobStatusPending.Id;
                updatedTracker.MAudId = jobStatusPending.Id;
                updatedTracker.CustomerServiceId = jobStatusPending.Id;
                updatedTracker.ModifiedOn = DateTime.Now;

                #endregion
            }

            //context.JobTrackers.Add(jobTrackerPersoOnly);
            //await context.SaveChangesAsync();
            #endregion

            return Ok();
        }


        /// Service Type Update
        /// Update the JobTracker and JobServiceType
        [HttpPost]
        [Route("servicetype/update")]
        public async Task<IHttpActionResult> UpdateServiceType2(ServiceTypeModel entity)
        {
            var jobStatusPending = _repo.FindJobStatusByName("Pending");
            var jobStatusCompleted = _repo.FindJobStatusByName("Completed");
            var jobStatusQueue = _repo.FindJobStatusByName("Queue");
            var jobStatusNotRequired = _repo.FindJobStatusByName("Not Required");

            var jobTypePersoOnly = _repo.FindJobTypeByName("Perso Only");
            var jobTypePrintingOnly = _repo.FindJobTypeByName("Printing Only");
            var jobTypeMailingOnly = _repo.FindJobTypeByName("Mailing Only");
            var jobTypeDispatchOnly = _repo.FindJobTypeByName("Dispatch Only");
            var jobTypePrintingAndPerso = _repo.FindJobTypeByName("Printing And Perso");
            var jobTypePrintingPersoAndMailing = _repo.FindJobTypeByName("Printing, Perso And Mailing");
            var jobTypePersoAndMailing = _repo.FindJobTypeByName("Perso And Mailing");
            
            var jobTracker = await context.JobTrackers.SingleOrDefaultAsync(j => j.Id == entity.JobTrackerId);
            var serviceType = await context.ServiceTypes.SingleOrDefaultAsync(k => k.Id == entity.ServiceTypeId);
            var job = await context.Jobs.SingleOrDefaultAsync(l => l.Id == entity.JobId);

            //Update Job
            job.ServiceTypeId = serviceType.Id;
            context.Jobs.Attach(job);
            context.Entry(job).State = EntityState.Modified;
            await context.SaveChangesAsync();

            //Update JobTracker
            #region JobTrackerSetup

            if (entity.ServiceTypeId == jobTypePersoOnly.Id)
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
            else if (entity.ServiceTypeId == jobTypePrintingOnly.Id)
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
            else if (entity.ServiceTypeId == jobTypeMailingOnly.Id)
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
            else if (entity.ServiceTypeId == jobTypeDispatchOnly.Id)
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
            else if (entity.ServiceTypeId == jobTypePrintingAndPerso.Id)
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
            else if (entity.ServiceTypeId == jobTypePersoAndMailing.Id)
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
            else if (entity.ServiceTypeId == jobTypePrintingPersoAndMailing.Id)
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
            
            context.JobTrackers.Attach(jobTracker);
            context.Entry(jobTracker).State = EntityState.Modified;
            await context.SaveChangesAsync();

            #endregion



            return Ok();
        }

    }
}
