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
    [Authorize]
    [RoutePrefix("api/customer-services")]
    public class CSController : ApiController
    {
        private readonly ApplicationRepository _repo = null;
        public readonly SidimBreezeRepository _repository = new SidimBreezeRepository();
        ApplicationDbContext context = new ApplicationDbContext();

        string userId;

        public CSController()
        {
            _repo = new ApplicationRepository();
        }

        [Route("deliveryNote/create")]
        public async Task<IHttpActionResult> CreateDispatch(AuDispatchModel entity)
        {
            userId = User.Identity.GetUserId();


            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var deliveryNote = await context.DeliveryNotes.FindAsync(entity.DeliveryNoteId);
            var deliveryNoteLogs = _repo.FindDeliveryNoteLogByNoteId(deliveryNote.Id);

            var jobStatusWIP = _repo.FindJobStatusByName("WIP");
            var jobStatusCompleted = _repo.FindJobStatusByName("Completed");
            var jobStatusQueue = _repo.FindJobStatusByName("Queue");
            var jobStatusNotDelivered = _repo.FindJobStatusByName("Not Delivered");
            var jobStatusDelivered = _repo.FindJobStatusByName("Delivered");

            // get all the jobTracker
            foreach (var m in deliveryNoteLogs)
            {
                // Update deliveryNoteLog Status
                m.CustomerServiceStatus = true;
                var t0 = await UpdateDeliveryNoteLog(m.Id, m);

                // Update JobTracker
                //var jobTrackerUpdate = await context.JobTrackers.FindAsync(m.JobTrackerId);
                var jobTrackerUpdate = await context.JobTrackers.Include(a => a.Job).FirstOrDefaultAsync(b => b.Id == m.JobTrackerId);

                jobTrackerUpdate.MAudId = jobStatusDelivered.Id;
                
                var totalDelivery = m.QuantityDelivered + m.PreviousDelivery + m.Ommitted;

                if (jobTrackerUpdate.Job.Quantity == totalDelivery)
                {
                    // Update Job to complete
                    var selectedJob = await context.Jobs.FindAsync(jobTrackerUpdate.JobId);
                    selectedJob.JobStatusId = jobStatusCompleted.Id;
                    var tJob = await UpdateJob(selectedJob.Id, selectedJob);

                    // Update JobTracker
                    jobTrackerUpdate.DispatchId = jobStatusCompleted.Id;
                    jobTrackerUpdate.CustomerServiceId = jobStatusCompleted.Id;
                    jobTrackerUpdate.IsCompleted = true;
                    jobTrackerUpdate.JobStatusId = jobStatusCompleted.Id;
                }
                else
                {
                    jobTrackerUpdate.CustomerServiceId = jobStatusWIP.Id;
                }

                //Todo: check if the delivery is completed
                var t1 = await UpdateJobTracker(jobTrackerUpdate.Id, jobTrackerUpdate);
                
                // Create the CS
                var newEntity = new Sid09CustomerService()
                {
                    CreatedById = userId,
                    CreatedOn = DateTime.Now,
                    DeliveryNoteLogId = m.Id
                };

                context.Sid09CustomerServices.Add(newEntity);
                await context.SaveChangesAsync();
            }

            //Update DeliveryNote
            deliveryNote.CustomerServiceStatus = true;
            var t2 = await UpdateDeliveryNote(deliveryNote.Id, deliveryNote);
            
            return Ok();
        }
        
        public async Task<IHttpActionResult> UpdateDeliveryNote(int id, DeliveryNote entity)
        {
            var existingEntity = await context.DeliveryNotes.FindAsync(entity.Id);

            if (id != entity.Id) { return BadRequest(ModelState); }

            if (existingEntity != null && context.Entry(existingEntity).State != EntityState.Detached)
            {
                context.Entry(existingEntity).State = EntityState.Detached;
            }

            var local = context.Set<DeliveryNote>().Local.FirstOrDefault(f => f.Id == entity.Id);
            if (local != null) { context.Entry(local).State = EntityState.Detached; }


            context.DeliveryNotes.Attach(entity);
            context.Entry(entity).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok<DeliveryNote>(entity);

        }

        public async Task<IHttpActionResult> UpdateDeliveryNoteLog(int id, DeliveryNoteLog entity)
        {
            var existingEntity = await context.DeliveryNoteLogs.FindAsync(entity.Id);

            if (id != entity.Id) { return BadRequest(ModelState); }

            if (existingEntity != null && context.Entry(existingEntity).State != EntityState.Detached)
            {
                context.Entry(existingEntity).State = EntityState.Detached;
            }

            var local = context.Set<DeliveryNoteLog>().Local.FirstOrDefault(f => f.Id == entity.Id);
            if (local != null) { context.Entry(local).State = EntityState.Detached; }


            context.DeliveryNoteLogs.Attach(entity);
            context.Entry(entity).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok<DeliveryNoteLog>(entity);

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

            entity.ModifiedOn = DateTime.Now;

            context.JobTrackers.Attach(entity);
            context.Entry(entity).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok<JobTracker>(entity);

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

            entity.ModifiedOn = DateTime.Now;

            context.Jobs.Attach(entity);
            context.Entry(entity).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok<Job>(entity);

        }

    }


}
