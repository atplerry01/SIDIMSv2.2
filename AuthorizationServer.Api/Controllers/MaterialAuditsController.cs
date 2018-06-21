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
    [RoutePrefix("api/material-audits")]
    public class MaterialAuditsController : ApiController
    {
        private readonly ApplicationRepository _repo = null;
        public readonly SidimBreezeRepository _repository = new SidimBreezeRepository();
        ApplicationDbContext context = new ApplicationDbContext();

        string userId;

        public MaterialAuditsController()
        {
            _repo = new ApplicationRepository();
            //_repository = new SidimBreezeRepository();
            //string userId = User.Identity.GetUserId();
        }

        [Route("dispatch/create")]
        public async Task<IHttpActionResult> CreateDispatch(AuDispatchModel entity)
        {
            userId = User.Identity.GetUserId();


            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Create the DeleveryNote
            var newEntity = new DeliveryNoteMaterialAudit()
            {
                CreatedById = userId,
                CreatedOn = DateTime.Now,
                DeliveryNoteId = entity.DeliveryNoteId,
                AssignedDriverId = entity.DriverId

            };

            context.DeliveryNoteMaterialAudits.Add(newEntity);
            await context.SaveChangesAsync();
            

            // Others
            var deliveryNote = await context.DeliveryNotes.FindAsync(entity.DeliveryNoteId);
            var deliveryNoteLogs = _repo.FindDeliveryNoteLogByNoteId(deliveryNote.Id);
            
            var jobStatusWIP = _repo.FindJobStatusByName("WIP");
            var jobStatusCompleted = _repo.FindJobStatusByName("Completed");
            var jobStatusQueue = _repo.FindJobStatusByName("Queue");
            var jobStatusNotDelivered = _repo.FindJobStatusByName("Not Delivered");

            // get all the jobTracker
            foreach (var m in deliveryNoteLogs)
            {
                // Update deliveryNoteLog Status
                m.AuditStatus = true;
                var t0 = await UpdateDeliveryNoteLog(m.Id, m);

                // Update JobTracker
                var jobTrackerUpdate = await context.JobTrackers.FindAsync(m.JobTrackerId);

                jobTrackerUpdate.MAudId = jobStatusNotDelivered.Id;
                jobTrackerUpdate.ModifiedOn = DateTime.Now;
                var t1 = await UpdateJobTracker(jobTrackerUpdate.Id, jobTrackerUpdate);

                //Todo: Update the Tracker if job is completed
                //Check if all itm delivery to make completed
            }

            var updateNote = deliveryNote;
            updateNote.AuditStatus = true;
            await UpdateDeliveryNote(updateNote.Id, updateNote);

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

            context.JobTrackers.Attach(entity);
            context.Entry(entity).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok<JobTracker>(entity);

        }


    }
}
