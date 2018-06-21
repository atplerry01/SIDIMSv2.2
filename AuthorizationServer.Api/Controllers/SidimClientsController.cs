using System;
using System.Data.Entity;
using AuthorizationServer.Api.Infrastructure;
using Breeze.ContextProvider.EF6;
using Breeze.WebApi2;
using Microsoft.AspNet.Identity.EntityFramework;
using SID.Common.Model.Infrastructure;
using SID.Common.Model.Inventory;
using SID.Common.Model.Lookups;
using SID.Common.Model.Production;
using System.Linq;
using System.Web.Http;
using Microsoft.AspNet.Identity;

namespace AuthorizationServer.Api.Controllers
{
    [Authorize]
    [BreezeController]
    public class SidimClientsController : BaseApiController
    {
        readonly SidimBreezeRepository _repository = new SidimBreezeRepository();
        readonly EFContextProvider<ApplicationDbContext> ContextProvider = new EFContextProvider<ApplicationDbContext>();

        private readonly ApplicationRepository _repo = null;
        ApplicationDbContext _context = new ApplicationDbContext();

        public SidimClientsController()
        {
            _repo = new ApplicationRepository();
        }

        //[AllowAnonymous]
        [HttpGet]
        public string Metadata()
        {
            return _repository.Metadata;
        }

        /// <summary>
        /// Unit Resources
        /// </summary>
        /// <returns></returns>

        #region Unit Resources [HttpGet]

        [HttpGet]
        public IQueryable<Job> Jobs()
        {
            return _repository.Jobs;
        }

        [HttpGet]
        public IQueryable<Job> PendingJobs()
        {
            var jobStatus = _repo.FindJobStatusByName("Pending");
            return _repository.Jobs.Where(a => a.JobStatusId == jobStatus.Id && a.IsDeleted == false);
        }
        
        [HttpGet]
        public IQueryable<Job> CompletedJobs()
        {
            var jobStatus = _repo.FindJobStatusByName("Completed");
            return _repository.Jobs.Where(a => a.JobStatusId == jobStatus.Id && a.IsDeleted == false);
        }



        [HttpGet]
        public IQueryable<ApplicationUser> GetUser(string username)
        {
            return _repository.Users.Where(a => a.UserName == username);
        }

        [HttpGet]
        public IQueryable<JobTracker> JobTrackers()
        {
            return _repository.JobTrackers.Where(a => a.IsCompleted == false && a.IsFlag == false && a.IsDeleted == false);
        }

        [HttpGet]
        public IQueryable<JobHandler> JobHandlers(int jobSplitId)
        {
            return _repository.JobHandlers.Where(a => a.JobSplitId == jobSplitId);
        }

        [HttpGet]
        public IQueryable<JobSplit> JobSplits()
        {
            return _repository.JobSplits;
        }

        [HttpGet]
        public IQueryable<JobSplit> JobSplitByTrackerId(int jobTrackerId)
        {
            return _repository.JobSplits.Where(a => a.JobTrackerId == jobTrackerId);
        }

        [HttpGet]
        public IQueryable<Job> WIPJobs()
        {
            var jobStatus = _repo.FindJobStatusByName("WIP");
            return _repository.Jobs.Where(a => a.JobStatusId == jobStatus.Id && a.IsDeleted == false);
        }

        [HttpGet]
        public IQueryable<Job> DeliveredJobs()
        {
            var jobStatus = _repo.FindJobStatusByName("Delivered");
            return _repository.Jobs.Where(a => a.JobStatusId == jobStatus.Id && a.IsDeleted == false);
        }


        [HttpGet]
        public IQueryable<Job> JobByTrackerId(int jobTrackerId)
        {
            var jobTracker = _repository.JobTrackers.Where(a => a.Id == jobTrackerId && a.IsDeleted == false);
            return _repository.Jobs.Where(a => jobTracker.Any(b => b.JobId == a.Id) && a.IsDeleted == false);
        }


        [HttpGet]
        public IQueryable<Sid01CardOps> CardOpsByJobId(int jobId)
        {
            return _repository.Sid01CardOps.Where(a => a.JobId == jobId);
        }


        [HttpGet]
        public IQueryable<Sid01CardOps> SidCardOpsByJobTrackerId(int jobTrackerId)
        {
            var jobTracker = _repository.JobTrackers.Where(a => a.Id == jobTrackerId && a.IsDeleted == false);
            return _repository.Sid01CardOps.Where(a => jobTracker.Any(b => b.JobId == a.JobId));
        }

        [HttpGet]
        public IQueryable<Sid03FirstCard> SidFirstCardByJobTrackerId(int jobTrackerId)
        {
            return _repository.Sid03FirstCards.Where(a => a.JobTrackerId == jobTrackerId); //(a => jobBatchTracker.Any(b => b.Id == a.JobBatchTrackerId));
        }


        [HttpGet]
        public IQueryable<Sid04Printing> SidPrintingByJobTrackerId(int jobTrackerId)
        {
            return _repository.Sid04Printings.Where(a => a.JobTrackerId == jobTrackerId);
        }

        [HttpGet]
        public IQueryable<Sid05QA> SidQAByJobTrackerId(int jobTrackerId)
        {
            var jobTracker = _repository.JobTrackers.Where(a => a.Id == jobTrackerId && a.IsDeleted == false);
            return _repository.Sid05QAs.Where(a => jobTracker.Any(b => b.Id == a.JobTrackerId));
        }

        [HttpGet]
        public IQueryable<Sid06QC> SidQCByJobTrackerId(int jobTrackerId)
        {
            var jobTracker = _repository.JobTrackers.Where(a => a.Id == jobTrackerId && a.IsDeleted == false);
            return _repository.Sid06QCs.Where(a => jobTracker.Any(b => b.Id == a.JobTrackerId));
        }

        [HttpGet]
        public IQueryable<CardIssuanceLog> CardIssuanceLogByJobId(int jobId)
        {
            //var job = _repository.Jobs.Where(a => a.Id == jobId);
            var jobTrackers = _repository.JobTrackers.Include("Job").Where(a => a.Job.Id == jobId && a.IsDeleted == false);
            return _repository.CardIssuanceLogs.Where(a => jobTrackers.Any(b => b.Id == a.JobTrackerId) && a.IsDeleted == false);
        }

        [HttpGet]
        public IQueryable<CardIssuanceLog> CardIssuanceLogByTrackerId(int jobTrackerId)
        {
            return _repository.CardIssuanceLogs.Where(a => a.JobTrackerId == jobTrackerId && a.IsDeleted == false);
        }

        [HttpGet]
        public IQueryable<JobSplitPrintCEAnalysis> JobSplitPrintCEAnalysisByTrackerId(int jobTrackerId)
        {
            return _repository.JobSplitPrintCEAnalysis.Include("JobSplit").Where(a => a.JobSplit.JobTrackerId == jobTrackerId);
        }


        #endregion

        /// <summary>
        /// Account Resources
        /// </summary>
        /// 
        #region InventoryAccount

        [HttpGet]
        public IQueryable<ApplicationUser> Users()
        {
            return _repository.Users.Include("Roles");
        }

        //[HttpGet]
        //public IQueryable<IdentityUserRole> UserRoles()
        //{
        //    return _repository.UserRoles;
        //}


        [HttpGet]
        public IQueryable<IdentityRole> Roles()
        {
            return _repository.Roles;
        }

        [HttpGet]
        public IQueryable<IdentityRole> UserRoles(string userId)
        {
            var userRoles = _repository.Roles.Where(x => x.Users.Any(y => y.UserId == userId));
            return userRoles;
        }


        [HttpGet]
        public IQueryable<ApplicationUser> InventoryUsers()
        {
            var roleInventory = _repository.Roles.Where(r => r.Name == "Inventory").SingleOrDefault();
            var roleCardEngr = _repository.Roles.Where(r => r.Name == "CardEngr").SingleOrDefault();
            var roleMailing = _repository.Roles.Where(r => r.Name == "Mailing").SingleOrDefault();
            var roleSupervisor = _repository.Roles.Where(r => r.Name == "Supervisor").SingleOrDefault();

            var usersInRole = _repository.Users.Where(x => x.Roles.Any(r => r.RoleId == roleInventory.Id || r.RoleId == roleCardEngr.Id || r.RoleId == roleMailing.Id || r.RoleId == roleSupervisor.Id));
            return usersInRole;
        }

        [HttpGet]
        public IQueryable<ApplicationUser> InventoryStaffs()
        {
            var myRoles = _repository.Roles.Where(r => r.Name == "Inventory").SingleOrDefault();
            var usersInRole = _repository.Users.Where(x => x.Roles.Any(r => r.RoleId == myRoles.Id));
            return usersInRole;
        }

        [HttpGet]
        public IQueryable<ApplicationUser> CardEngrStaffs()
        {
            var myRoles = _repository.Roles.Where(r => r.Name == "CardEngr").SingleOrDefault();
            var usersInRole = _repository.Users.Where(x => x.Roles.Any(r => r.RoleId == myRoles.Id));
            return usersInRole;
        }



        [HttpGet]
        public IQueryable<ApplicationUser> MailingStaffs()
        {
            var myRoles = _repository.Roles.Where(r => r.Name == "Mailing").SingleOrDefault();
            var usersInRole = _repository.Users.Where(x => x.Roles.Any(r => r.RoleId == myRoles.Id));
            return usersInRole;
        }

        [HttpGet]
        public IQueryable<ApplicationUser> SupervisorStaffs()
        {
            var myRoles = _repository.Roles.Where(r => r.Name == "Supervisor").SingleOrDefault();
            var usersInRole = _repository.Users.Where(x => x.Roles.Any(r => r.RoleId == myRoles.Id));
            return usersInRole;
        }

        [HttpGet]
        public IQueryable<ApplicationUser> AdminStaffs()
        {
            var myRoles = _repository.Roles.Where(r => r.Name == "Admin").SingleOrDefault();
            var usersInRole = _repository.Users.Where(x => x.Roles.Any(r => r.RoleId == myRoles.Id));
            return usersInRole;
        }

        [HttpGet]
        public IQueryable<ApplicationUser> ProductionStaffs()
        {
            var adminRoles = _repository.Roles.Where(r => r.Name == "Admin").SingleOrDefault();
            var inventoryRoles = _repository.Roles.Where(r => r.Name == "Inventory").SingleOrDefault();
            var supervisorRoles = _repository.Roles.Where(r => r.Name == "Supervisor").SingleOrDefault();
            var cardEngrRoles = _repository.Roles.Where(r => r.Name == "CardEngr").SingleOrDefault();
            var mailingRoles = _repository.Roles.Where(r => r.Name == "Mailing").SingleOrDefault();
            var QARoles = _repository.Roles.Where(r => r.Name == "QA").SingleOrDefault();
            var QCRoles = _repository.Roles.Where(r => r.Name == "QC").SingleOrDefault();
            var SARoles = _repository.Roles.Where(r => r.Name == "SuperAdmin").SingleOrDefault();
            var PrintingRoles = _repository.Roles.Where(r => r.Name == "Printing").SingleOrDefault();
            var SuperAdminRoles = _repository.Roles.Where(r => r.Name == "SuperAdmin").SingleOrDefault();

            var usersInRole = _repository.Users.Where(x => x.Roles.Any(r => r.RoleId == adminRoles.Id ||
                            r.RoleId == supervisorRoles.Id || r.RoleId == mailingRoles.Id ||
                            r.RoleId == QARoles.Id || r.RoleId == QCRoles.Id || r.RoleId == SARoles.Id ||
                            r.RoleId == PrintingRoles.Id || r.RoleId == cardEngrRoles.Id || r.RoleId == inventoryRoles.Id));

            return usersInRole;
        }

        [HttpGet]
        public IQueryable<ApplicationUser> Drivers()
        {
            var myRoles = _repository.Roles.Where(r => r.Name == "Driver").SingleOrDefault();
            var usersInRole = _repository.Users.Where(x => x.Roles.Any(r => r.RoleId == myRoles.Id));
            return usersInRole;
        }


        [HttpGet]
        public IQueryable<ApplicationUser> RMUsers()
        {
            var roleRM = _repository.Roles.Where(r => r.Name == "RM").SingleOrDefault();

            var usersInRole = _repository.Users.Where(x => x.Roles.Any(r => r.RoleId == roleRM.Id));
            return usersInRole;
        }

        //[HttpGet]
        //public IQueryable<IdentityRole> Roles()
        //{
        //    return _repository.Roles;
        //}

        #endregion


        [HttpGet]
        public IQueryable<NonPersoJob> NonPersoJobs()
        {
            return _repository.NonPersoJobs.Where(a => a.IsTreated == false && a.IsDeleted == false);
        }

        [HttpGet]
        public IQueryable<NonPersoJob> RMNonPersoJobs()
        {
            var userId = User.Identity.GetUserId();
            return _repository.NonPersoJobs.Where(a => a.CreatedById == userId);
        }



        /// <summary>
        /// Jobs Resources
        /// </summary>
        /// 

        #region Job Resources

        [HttpGet]
        public IQueryable<ServerJobQueue> RecentServerJobQueues()
        {
            DateTime recentTime = DateTime.Now.AddHours(-2);
            return _repository.ServerJobQueues.Where(a => a.IsTreated == false && a.CreatedOn >= recentTime);
        }

        [HttpGet]
        public IQueryable<ServerJobQueue> ServerJobQueues()
        {
            return _repository.ServerJobQueues.Where(a => a.IsTreated == false);
        }

        [HttpGet]
        public IQueryable<DeliveryNote> DeliveryNotes()
        {
            return _repository.DeliveryNotes;
        }

        [HttpGet]
        public IQueryable<WasteDeliveryNote> WasteDeliveryNotes()
        {
            return _repository.WasteDeliveryNotes;
        }

        [HttpGet]
        public IQueryable<WasteDeliveryNote> WasteDeliveryNoteById(int id)
        {
            var test = _repository.WasteDeliveryNotes.Where(i => i.Id == id);
            return _repository.WasteDeliveryNotes.Where(i => i.Id == id);
        }

        [HttpGet]
        public IQueryable<DeliveryProfile> DeliveryProfiles()
        {
            return _repository.DeliveryProfiles;
        }

        [HttpGet]
        public IQueryable<CardWasteAnalysis> CardWasteAnalysis()
        {
            return _repository.CardWasteAnalysis;
        }

        [HttpGet]
        public IQueryable<CardWasteAnalysis> PendingCardWaste(int clientId)
        {
            return _repository.CardWasteAnalysis.Where(w => w.IsWasteDispatch == false && w.IsCardCollected == true && w.JobTracker.Job.SidClientId == clientId);
        }

        [HttpGet]
        public IQueryable<PrintWasteAnalysis> PrintWasteAnalysis()
        {
            return _repository.PrintWasteAnalysis;
        }

        [HttpGet]
        public IQueryable<Job> IncompleteJobs()
        {
            var jobStatusPending = _repo.FindJobStatusByName("Pending");
            var jobStatusQueue = _repo.FindJobStatusByName("Queue");
            var jobStatusWIP = _repo.FindJobStatusByName("WIP");
            var jobStatusFlagged = _repo.FindJobStatusByName("Flagged");

            return _repository.Jobs.Where(j => j.JobStatusId == jobStatusPending.Id || 
                j.JobStatusId == jobStatusQueue.Id || j.JobStatusId == jobStatusWIP.Id || 
                j.JobStatusId == jobStatusFlagged.Id && j.IsDeleted == false);
        }

        [HttpGet]
        public IQueryable<JobTracker> JobTrackerByJobId(int jobId)
        {
            return _repository.JobTrackers.Where(a => a.JobId == jobId && a.IsDeleted == false);
        }

        [HttpGet]
        public IQueryable<JobVariant> JobVariantByJobId(int jobId, int jobTrackerId)
        {
            return _repository.JobVariants.Where(a => a.JobId == jobId && a.JobTrackerId == jobTrackerId);
        }

        [HttpGet]
        public IQueryable<JobVariant> JobVariantByJobTrackerId(int jobTrackerId)
        {
            return _repository.JobVariants.Where(a => a.JobTrackerId == jobTrackerId);
        }


        [HttpGet]
        public IQueryable<JobSplit> CEJobSplitByJobTrackerId(int jobTrackerId)
        {
            var depart = _repo.FindDepartmentByName("Card Engineer");
            return _repository.JobSplits.Where(a => a.JobTrackerId == jobTrackerId);
        }

        [HttpGet]
        public IQueryable<JobSplit> PersoJobSplitByJobTrackerId(int jobTrackerId)
        {
            var depart = _repo.FindDepartmentByName("Card Engineer");
            return _repository.JobSplits.Where(a => a.JobTrackerId == jobTrackerId && a.DepartmentId == depart.Id);
        }

        [HttpGet]
        public IQueryable<JobSplit> PrintJobSplitByJobTrackerId(int jobTrackerId)
        {
            var depart = _repo.FindDepartmentByName("Printing");
            return _repository.JobSplits.Where(a => a.JobTrackerId == jobTrackerId && a.DepartmentId == depart.Id);
        }

        [HttpGet]
        public IQueryable<JobSplit> MailingJobSplitByJobTrackerId(int jobTrackerId)
        {
            var department = _repo.FindDepartmentByName("Mailing");
            return _repository.JobSplits.Where(j => j.DepartmentId == department.Id && j.JobTrackerId == jobTrackerId);
        }




        [HttpGet]
        public IQueryable<JobSplitCEAnalysis> IncomingCEJobSplitAnalysisByJobTrackerId(int jobTrackerId)
        {
            var jobSplits = _repository.JobSplits.Where(a => a.JobTrackerId == jobTrackerId);
            return _repository.JobSplitCEAnalysis.Where(a => jobSplits.Any(b => b.Id == a.JobSplitId));
        }

        //Todo; same as CEJobSplit
        [HttpGet]
        public IQueryable<JobSplitPrintCEAnalysis> IncomingPrintCEJobSplitAnalysisByJobTrackerId(int jobTrackerId)
        {
            var jobSplits = _repository.JobSplits.Where(a => a.JobTrackerId == jobTrackerId);
            return _repository.JobSplitPrintCEAnalysis.Where(a => jobSplits.Any(b => b.Id == a.JobSplitId));
        }


        [HttpGet]
        public IQueryable<Sid05QA> QABySplitId(int splitId)
        {
            return _repository.Sid05QAs.Where(a => a.JobSplitId == splitId);
        }

        [HttpGet]
        public IQueryable<JobSplitCEAnalysis> QAWasteRequests()
        {
            return _repository.JobSplitCEAnalysis.Include(a => a.JobTracker.Job).Where(a => a.QuantityBad > 0 || a.QuantityHeld > 0);
        }



        [HttpGet]
        public IQueryable<JobSplitPrintCEAnalysis> PrintQAWasteRequests()
        {
            return _repository.JobSplitPrintCEAnalysis.Include(a => a.JobTracker.Job).Where(a => a.QuantityBad > 0 || a.QuantityHeld > 0);
        }



        [HttpGet]
        public IQueryable<JobVariant> JobVariantByTrackerId(int trackerId)
        {
            var tracker = _context.JobTrackers.Find(trackerId);
            return _repository.JobVariants.Where(a => a.JobId == tracker.JobId);
        }


        // Print Section

        [HttpGet]
        public IQueryable<JobSplitPrintCEAnalysis> JobSplitPrintCEAnalysis()
        {
            return _repository.JobSplitPrintCEAnalysis;
        }


        [HttpGet]
        public IQueryable<JobSplitPrintCEAnalysis> JobSplitPrintAnalysisByTrackerId(int jobTrackerId)
        {
            return _repository.JobSplitPrintCEAnalysis.Where(a => a.JobTrackerId == jobTrackerId);
        }


        #endregion

        /// <summary>
        /// Admin Resources
        /// </summary>
        /// 


        #region Genral EndPoints

        [HttpGet]
        public IQueryable<JobSplitCEAnalysis> JobSplitCEAnalysis()
        {
            return _repository.JobSplitCEAnalysis;
        }


        [HttpGet]
        public IQueryable<JobSplitCEAnalysis> JobSplitCEAnalysisByDepartment(string department)
        {
            var depart = _repo.FindDepartmentByName(department);
            return _repository.JobSplitCEAnalysis.Include("JobSplit").Where(a => a.JobSplit.DepartmentId == depart.Id);
        }


        [HttpGet]
        public IQueryable<CardIssuanceLog> CardIssuanceLogs()
        {
            return _repository.CardIssuanceLogs.Where(a => a.IsDeleted == false);
        }

        [HttpGet]
        public IQueryable<JobSplit> PrJobSplits()
        {
            var depart = _repo.FindDepartmentByName("Printing");
            return _repository.JobSplits.Where(a => a.DepartmentId == depart.Id);
        }

        [HttpGet]
        public IQueryable<JobSplit> CEJobSplits()
        {
            var depart = _repo.FindDepartmentByName("Card Engineer");
            return _repository.JobSplits.Where(a => a.DepartmentId == depart.Id);
        }

        [HttpGet]
        public IQueryable<JobSplit> MAJobSplits()
        {
            var depart = _repo.FindDepartmentByName("Mailing");
            return _repository.JobSplits.Where(a => a.DepartmentId == depart.Id);
        }

        [HttpGet]
        public IQueryable<JobSplit> JobSlitByTrackerId(int jobTrackerId)
        {
            return _repository.JobSplits.Where(a => a.JobTrackerId == jobTrackerId);
        }


        #endregion

        /// <summary>
        /// Card Engr Resources
        /// </summary>
        /// 
        #region CardEngr

        [HttpGet]
        public IQueryable<JobTracker> CardEngrIncomingPersos()
        {
            var jobStatusQueue = _repo.FindJobStatusByName("Queue");
            var jobStatusCompleted = _repo.FindJobStatusByName("Completed");

            return _repository.JobTrackers.Where(j => j.FirstJobRunId == jobStatusQueue.Id && 
                    j.InventoryId == jobStatusCompleted.Id && j.IsDeleted == false);
        }

        [HttpGet]
        public IQueryable<JobTracker> CardEngrResumeNewPersos()
        {
            var jobStatusWIP = _repo.FindJobStatusByName("WIP");
            var jobStatusQueue = _repo.FindJobStatusByName("Queue");
            var jobStatusCompleted = _repo.FindJobStatusByName("Completed");

            var jobHasWaste = _repository.JobSplitCEAnalysis.Where(j => j.QuantityHeld > 0 || j.QuantityBad > 0);
            var resumableJobs = _repository.JobTrackers.Where(j => j.CardEngrResumeId == jobStatusQueue.Id && j.IsDeleted == false);

            var wasteResumables = _repository.JobTrackers.Where(j => j.CardEngrResumeId == jobStatusWIP.Id && j.IsDeleted == false);

            var wasteToDisplay = jobHasWaste.Where(w => wasteResumables.Any(r => r.Id == w.JobTrackerId));

            var result = _repository.JobTrackers.Where(j => (wasteToDisplay.Any(w => w.JobTrackerId == j.Id)) 
                || (resumableJobs.Any(r => r.Id == j.Id)) && j.IsDeleted == false);
            
            return result;


            //Todo: If the Error is still in Card
        }

        [HttpGet]
        public IQueryable<JobTracker> CardEngrResumePendingPersos()
        {
            var jobStatusWIP = _repo.FindJobStatusByName("WIP");
            var jobStatusQueue = _repo.FindJobStatusByName("Queue");
            var jobStatusCompleted = _repo.FindJobStatusByName("Completed");

            return _repository.JobTrackers.Where(j => j.FirstJobRunId == jobStatusCompleted.Id && 
                    j.QAId == jobStatusCompleted.Id && j.CardEngrResumeId == jobStatusWIP.Id && j.IsDeleted == false);
        }

        [HttpGet]
        public IQueryable<JobTracker> CardEngrResumePartialPersos()
        {
            var issuanceStatusPartial = _repo.FindIssuanceStatusByName("Partial");
            var jobStatusQueue = _repo.FindJobStatusByName("Queue");
            var jobStatusCompleted = _repo.FindJobStatusByName("Completed");

            var partialCardIssuance = _repository.CardIssuances.Where(x => x.IssuanceStatusId == issuanceStatusPartial.Id);
            var results = _repository.JobTrackers.Where(p => (partialCardIssuance.Any(p2 => p2.JobId == p.JobId 
                && p.CardEngrResumeId == jobStatusQueue.Id && p.FirstJobRunId == jobStatusCompleted.Id 
                && p.QAId == jobStatusCompleted.Id)) && p.IsDeleted == false);

            return results;
        }

        [HttpGet]
        public IQueryable<DeliveryProfile> DeliveryProfileByClientId(int sidClientId)
        {
            return _repository.DeliveryProfiles.Where(a => a.SidClientId == sidClientId);
        }


        [HttpGet]
        public IQueryable<SidClient> DispatchIncomingJobs()
        {
            var department = _repo.FindDepartmentByName("Dispatch");
            var departmentQC = _repo.FindDepartmentByName("Quality Control");
            var dispatchCardDelivery = _repository.CardDelivery.Where(a => a.IsCompleted == false && a.TargetDepartmentId == department.Id);
            var client = _repository.SidClients.Where(a => dispatchCardDelivery.Any(b => b.JobTracker.Job.SidClientId == a.Id));

            return client;
        }


        [HttpGet]
        public IQueryable<DeliveryNoteLog> DispatchDeliveryNoteLogs(int noteId)
        {
            return _repository.DeliveryNoteLogs.Where(a => a.DeliveryNoteId == noteId);
        }

        [HttpGet]
        public IQueryable<WasteDeliveryNoteLog> WasteDeliveryNoteLogs(int noteId)
        {
            return _repository.WasteDeliveryNoteLogs.Where(a => a.WasteDeliveryNoteId == noteId);
        }

        #endregion

        /// <summary>
        /// Inventory Resources
        /// </summary>
        /// 
        #region Inventory

        [HttpGet]
        public IQueryable<CardIssuance> CardIssuances()
        {
            return _repository.CardIssuances;
        }

        [HttpGet]
        public IQueryable<CardIssuance> CardIssuanceByJobId(int jobId)
        {
            return _repository.CardIssuances.Where(a => a.JobId == jobId);
        }

        [HttpGet]
        public IQueryable<Job> InventoryJobs()
        {
            return _repository.Jobs.Where(a => a.IsDeleted == false);
        }

        [HttpGet]
        public IQueryable<JobTracker> InventoryIncomingJobs()
        {
            var jobStatusQueue = _repo.FindJobStatusByName("Queue");
            return _repository.JobTrackers.Where(j => j.InventoryId == jobStatusQueue.Id 
                        && j.IsDeleted == false);
        }

        [HttpGet]
        public IQueryable<CardIssuance> InventoryPartialJobs()
        {
            return _repository.CardIssuances.Where(a => a.TotalQuantity != a.TotalQuantityIssued);
        }

        [HttpGet]
        public IQueryable<CardWasteAnalysis> ApprovedCardWastes()
        {
            return _repository.CardWasteAnalysis.Where(a => a.QuantityBad > 0 && a.IsCardCollected == false);
        }

        [HttpGet]
        public IQueryable<PrintWasteAnalysis> ApprovedPrintWastes()
        {
            return _repository.PrintWasteAnalysis.Where(a => a.QuantityBad > 0 && a.IsCardCollected == false);
        }

        [HttpGet]
        public IQueryable<JobTracker> JobTrackerByCEAnalysisId(int jobCEAnalysisId)
        {
            var jobCEAnalysis = _repo.FindCEJobAnalysisUsingId(jobCEAnalysisId);
            return ContextProvider.Context.JobTrackers.Where(a => a.Id == jobCEAnalysis.JobSplit.JobTrackerId);
        }

        [HttpGet]
        public IQueryable<JobWaste> InventoryCardWasteJobs(string name)
        {
            var wasteType = _repo.FindWasteTypeByName(name);
            return _repository.JobWastes.Where(j => j.WasteTypeId == wasteType.Id);
        }

        [HttpGet]
        public IQueryable<EmbedCardRequest> EmbedCardRequests()
        {
            return _repository.EmbedCardRequests;
        }

        [HttpGet]
        public IQueryable<EmbedCardRequest> EmbedCardRequestByProducts(int sidProductId)
        {
            return _repository.EmbedCardRequests.Where(a => a.SidProductId == sidProductId);
        }

        [HttpGet]
        public IQueryable<EmbedCardRequest> EmbedCardRequestByRequestId(int requestId)
        {
            return _repository.EmbedCardRequests.Where(a => a.Id == requestId && a.TotalBatchQty > a.TotalDelivered);
        }

        [HttpGet]
        public IQueryable<EmbedCardReceipt> EmbedCardReceipts()
        {
            return _repository.EmbedCardReceipts;
        }

        [HttpGet]
        public IQueryable<EmbedCardReceipt> EmbedCardReceiptLogs(int requestId)
        {
            return _repository.EmbedCardReceipts.Where(r => r.EmbedCardRequestId == requestId);
        }

        [HttpGet]
        public IQueryable<StationaryInwardGood> StationaryInwardGoods()
        {
            return _repository.StationaryInwardGoods;
        }

        [HttpGet]
        public IQueryable<StockStatus> StockStatus()
        {
            return _repository.StockStatus;
        }

        [HttpGet]
        public IQueryable<ClientVaultReport> ClientVaultReports(int sidProductId)
        {
            return _repository.ClientVaultReports.Where(a => a.SidProductId == sidProductId);
        }

        [HttpGet]
        public IQueryable<ClientVaultReport> ClientVaultReportByTrackerId(int trackerId)
        {
            var tracker = _context.JobTrackers.Find(trackerId);
            if (tracker != null)
            {
                var jobVariant = _repo.FindJobVariantByJobId(tracker.JobId, trackerId);

                if (jobVariant == null)
                {
                    return null;
                }

                return _repository.ClientVaultReports.Where(a => a.SidProductId == jobVariant.SidProductId);
            }

            return null;
        }


        [HttpGet]
        public IQueryable<ClientStockReport> ClientStockReports(int sidProductId)
        {
            return _repository.ClientStockReports.Where(a => a.SidProductId == sidProductId);
        }

        [HttpGet]
        public IQueryable<ClientStockReport> ClientStockReportByTrackerId(int trackerId)
        {
            var tracker = _context.JobTrackers.Find(trackerId);
            if (tracker != null)
            {
                var jobVariant = _repo.FindJobVariantByJobId(tracker.JobId, trackerId);

                if (jobVariant == null)
                {
                    return null;
                }

                return _repository.ClientStockReports.Where(a => a.SidProductId == jobVariant.SidProductId);
            }

            return null;
        }

       
        [HttpGet]
        public IQueryable<CardHeldAnalysis> IncomingHeldCards()
        {
            return _repository.CardHeldAnalysis.Where(a => a.IsCardCollected == false);
        }

        [HttpGet]
        public IQueryable<PrintHeldAnalysis> IncomingHeldPrints()
        {
            return _repository.PrintHeldAnalysis.Where(a => a.IsCardCollected == false);
        }

        [HttpGet]
        public IQueryable<JobSplitCEAnalysis> JobSplitCEAnalysisByTrackerId(int jobTrackerId)
        {
            return ContextProvider.Context.JobSplitCEAnalysis.Include("JobSplit").Where(a => a.JobSplit.JobTrackerId == jobTrackerId);
        }

        //[HttpGet]
        //public IQueryable<JobSplitQCAnalysis> JobSplitQCAnalysisByTrackerId(int jobTrackerId)
        //{
        //    return ContextProvider.Context.JobSplitQCAnalysis.Include("JobSplit").Where(a => a.JobSplit.JobTrackerId == jobTrackerId);
        //}

        [HttpGet]
        public IQueryable<JobSplitCEAnalysis> CESplitAnalysisByTrackerId(int jobTrackerId)
        {
            return ContextProvider.Context.JobSplitCEAnalysis.Include("JobSplit").Where(a => a.JobSplit.JobTrackerId == jobTrackerId);
        }

        [HttpGet]
        public IQueryable<JobSplitCEAnalysis> CESplitAnalysisHeldCardsByTrackerId(int jobTrackerId)
        {
            return ContextProvider.Context.JobSplitCEAnalysis.Include("JobSplit").Where(a => a.JobSplit.JobTrackerId == jobTrackerId && a.QuantityHeld > 0);
        }

        #endregion


        /// <summary>
        /// Printing Resources
        /// </summary>
        #region Printing


        [HttpGet] // PrintJobs
        public IQueryable<JobTracker> IncomingPrints()
        {
            var jobStatusQueue = _repo.FindJobStatusByName("Queue");
            return _repository.JobTrackers.Where(j => j.PrintingId == jobStatusQueue.Id && j.IsDeleted == false);
        }


        // Print Analysis
        [HttpGet] // PrintJobs
        public IQueryable<JobTracker> PrintAnalysis()
        {
            var jobStatusWIP = _repo.FindJobStatusByName("WIP");
            var jobStatusCompleted = _repo.FindJobStatusByName("Completed");
            var jobTracker = _repository.JobTrackers.Where(j => j.PrintingId == jobStatusWIP.Id && j.PrintQAId == jobStatusCompleted.Id && j.IsDeleted == false);
            var jobSplitAnalysis = _repository.JobSplitPrintCEAnalysis;
            return jobTracker.Where(a => jobSplitAnalysis.Any(b => b.JobSplit.JobTrackerId == a.Id));
        }

        [HttpGet]
        public IQueryable<JobTracker> PrintDeliverables()
        {
            var jobStatusWIP = _repo.FindJobStatusByName("WIP");
            var jobStatusCompleted = _repo.FindJobStatusByName("Completed");
            var jobTracker = _repository.JobTrackers.Where(j => j.PrintingId == jobStatusWIP.Id && 
                j.PrintQAId == jobStatusCompleted.Id && j.PrintQCId == jobStatusWIP.Id && j.IsDeleted == false);
            var jobSplitAnalysis = _repository.JobSplitPrintCEAnalysis;
            return jobTracker.Where(a => jobSplitAnalysis.Any(b => b.JobSplit.JobTrackerId == a.Id));
        }


        #endregion

        /// <summary>
        /// Quality Assurance Resources
        /// </summary>
        #region QAC Resources

        [HttpGet]
        public IQueryable<JobTracker> QAIncomingPersos()
        {
            // Todo:: Previous Task must me completed
            var jobStatusQueue = _repo.FindJobStatusByName("Queue");
            var jobStatusCompleted = _repo.FindJobStatusByName("Completed");

            var depart = _repo.FindDepartmentByName("Card Engineer");
            var jobSplit = _repository.JobSplits.Where(a => a.DepartmentId == depart.Id);

            return _repository.JobTrackers.Where(a => jobSplit.Any(b => b.JobTrackerId == a.Id && b.IsQACompleted == false) && a.IsDeleted == false);

        }

        [HttpGet]
        public IQueryable<JobTracker> QAIncomingPrints()
        {
            var depart = _repo.FindDepartmentByName("Printing");
            var jobSplit = _repository.JobSplits.Where(a => a.DepartmentId == depart.Id);

            return _repository.JobTrackers.Where(a => jobSplit.Any(b => b.JobTrackerId == a.Id && 
                b.IsQACompleted == false && a.IsDeleted == false));
        }

        [HttpGet]
        public IQueryable<JobTracker> QCIncomingPersos()
        {
            var jobStatusQueue = _repo.FindJobStatusByName("Queue");
            return _repository.JobTrackers.Where(j => j.QCId == jobStatusQueue.Id && j.IsDeleted == false);
        }

        [HttpGet]
        public IQueryable<JobTracker> QCPendingPersos()
        {
            var jobStatusWip = _repo.FindJobStatusByName("WIP");
            return _repository.JobTrackers.Where(j => j.QCId == jobStatusWip.Id && j.IsDeleted == false);
        }


        [HttpGet]
        public IQueryable<JobTracker> QCPendingDelivery()
        {
            var jobStatusWIP = _repo.FindJobStatusByName("WIP");
            return _repository.JobTrackers.Where(j => j.QCId == jobStatusWIP.Id && j.IsDeleted == false);
        }

        [HttpGet]
        public IQueryable<CardDelivery> PrintCardDelivery()
        {
            var depart = _repo.FindDepartmentByName("Printing");
            return _repository.CardDelivery.Where(j => j.DepartmentId == depart.Id);
        }

        [HttpGet]
        public IQueryable<CardDelivery> CECardDelivery()
        {
            var depart = _repo.FindDepartmentByName("Card Engineer");
            return _repository.CardDelivery.Where(j => j.DepartmentId == depart.Id);
        }

        [HttpGet]
        public IQueryable<CardDelivery> MailingCardDelivery()
        {
            var depart = _repo.FindDepartmentByName("Mailing");
            return _repository.CardDelivery.Where(j => j.DepartmentId == depart.Id);
        }

        [HttpGet]
        public IQueryable<CardDelivery> QCCardDeliveryLists(int jobTrackerId)
        {
            var depart = _repo.FindDepartmentByName("Quality Control");
            return _repository.CardDelivery.Where(j => j.JobTrackerId == jobTrackerId && j.DepartmentId == depart.Id);
        }


        [HttpGet]
        public IQueryable<CardDelivery> CEDepCardDeliverys()
        {
            var department = _repo.FindDepartmentByName("Card Engineer");
            return _repository.CardDelivery.Where(j => j.DepartmentId == department.Id);
        }

        [HttpGet]
        public IQueryable<CardDeliveryLog> CEDepCardDeliveryLogs()
        {
            var department = _repo.FindDepartmentByName("Card Engineer");
            return _repository.CardDeliveryLogs.Include("CardDelivery").Where(j => j.CardDelivery.DepartmentId == department.Id && j.IsDeleted == false);
        }


        [HttpGet]
        public IQueryable<CardDeliveryLog> CECardDeliveryLogs(int jobTrackerId)
        {
            var department = _repo.FindDepartmentByName("Card Engineer");
            var cardDelivery = _repo.FindCardDeliveryByTrackerDepart(jobTrackerId, department.Id);
            return _repository.CardDeliveryLogs.Where(j => j.CardDeliveryId == cardDelivery.Id && j.IsDeleted == false);
        }

        [HttpGet]
        public IQueryable<CardDeliveryLog> PrQCCardDeliveryLogs(int jobTrackerId)
        {
            var department = _repo.FindDepartmentByName("Printing");
            var cardDelivery = _repo.FindCardDeliveryByTrackerDepart(jobTrackerId, department.Id);
            if (cardDelivery != null)
            {
                return _repository.CardDeliveryLogs.Where(j => j.CardDeliveryId == cardDelivery.Id && j.IsDeleted == false);
            }

            return null;

        }

        [HttpGet]
        public IQueryable<CardDeliveryLog> QCCardDeliveryLogs(int jobTrackerId)
        {
            var department = _repo.FindDepartmentByName("Quality Control");
            var cardDelivery = _repo.FindCardDeliveryByTrackerDepart(jobTrackerId, department.Id);
            if (cardDelivery != null)
            {
                return _repository.CardDeliveryLogs.Where(j => j.CardDeliveryId == cardDelivery.Id && j.IsDeleted == false);
            }

            return null;

        }

        [HttpGet]
        public IQueryable<CardDeliveryLog> MACardDeliveryLogs(int jobTrackerId)
        {
            var department = _repo.FindDepartmentByName("Mailing");
            var cardDelivery = _repo.FindCardDeliveryByTrackerDepart(jobTrackerId, department.Id);
            return _repository.CardDeliveryLogs.Where(j => j.CardDeliveryId == cardDelivery.Id && j.IsDeleted == false);
        }

        [HttpGet]
        public IQueryable<CardDeliveryLog> DPCardDeliveryLogs(int clientId)
        {
            var department = _repo.FindDepartmentByName("Dispatch");
            return _repository.CardDeliveryLogs.Include("CardDelivery").Where(a => a.CardDelivery.TargetDepartmentId == department.Id && a.JobTracker.Job.SidClientId == clientId && a.IsConfirmed == false && a.IsDeleted == false);
        }

        [HttpGet]
        public IQueryable<DispatchDelivery> DispatchDelivery(int clientId)
        {
            return _repository.DispatchDelivery.Where(a => a.IsNoteGenerated == false && a.SidClientId == clientId);
        }

        [HttpGet]
        public IQueryable<DispatchDelivery> DispatchDeliveryGenerated(int clientId)
        {
            return _repository.DispatchDelivery.Where(a => a.SidClientId == clientId && a.IsNoteGenerated == true);
        }

        [HttpGet]
        public IQueryable<JobTracker> DispatchJobTracker()
        {
            var jobStatusQueue = _repo.FindJobStatusByName("Queue");
            return _repository.JobTrackers.Include("Job").Where(a => a.DispatchId == jobStatusQueue.Id && a.IsDeleted == false);
        }

        [HttpGet]
        public IQueryable<DeliveryNote> DispatchDeliveryNotes()
        {
            return _repository.DeliveryNotes;
        }

        [HttpGet]
        public IQueryable<WasteDeliveryNote> WasteDispatchDeliveryNotes()
        {
            return _repository.WasteDeliveryNotes;
        }


        [HttpGet]
        public IQueryable<CardDeliveryLog> DPCardDeliveryLogConfirmations()
        {
            var department = _repo.FindDepartmentByName("Dispatch");
            var cardDelivery = _repository.CardDelivery.Where(a => a.DepartmentId == department.Id && a.IsCompleted == false);
            return _repository.CardDeliveryLogs.Include("JobTracker").Where(a => cardDelivery.Any(b => b.Id == a.CardDeliveryId) && a.IsConfirmed == false);
        }

        [HttpGet]
        public IQueryable<CardDeliveryLog> DPCardDeliveryNotes()
        {
            var department = _repo.FindDepartmentByName("Dispatch");
            var cardDelivery = _repository.CardDelivery.Where(a => a.DepartmentId == department.Id && a.IsCompleted == false);
            return _repository.CardDeliveryLogs.Include("JobTracker").Where(a => cardDelivery.Any(b => b.Id == a.CardDeliveryId) && a.IsConfirmed == true && a.IsDeleted == false);
        }

        [HttpGet]
        public IQueryable<JobTracker> QCIncomingPrints()
        {
            var jobStatusWIP = _repo.FindJobStatusByName("WIP");
            return _repository.JobTrackers.Where(a => a.PrintingId == jobStatusWIP.Id && a.IsDeleted == false);
        }

        #endregion


        /// Material Audit
        ///// 
        [HttpGet]
        public IQueryable<DeliveryNote> MAudIncomingJobs()
        {
            return _repository.DeliveryNotes.Where(a => a.AuditStatus == false);
        }


        // Customer Service
        [HttpGet]
        public IQueryable<DeliveryNote> CSIncomingJobs()
        {
            return _repository.DeliveryNotes.Where(a => a.CustomerServiceStatus == false);
        }





        /// <summary>
        /// Mailing Resources
        /// </summary>
        #region Mailing


        [HttpGet]
        public IQueryable<JobTracker> MAIncomingJobs()
        {
            // Todo:: Previous Task must me completed
            var jobStatusQueue = _repo.FindJobStatusByName("Queue");
            return _repository.JobTrackers.Where(j => j.MailingId == jobStatusQueue.Id && j.IsDeleted == false);
        }

        [HttpGet]
        public IQueryable<JobTracker> MAPendingDeliverys()
        {
            // Todo:: Previous Task must me completed
            var jobStatusWIP = _repo.FindJobStatusByName("WIP");
            return _repository.JobTrackers.Where(j => j.MailingId == jobStatusWIP.Id && j.IsDeleted == false);
        }



        #endregion

        /// <summary>
        /// Lookups Resources
        /// </summary>
        #region LookupsRegion

        [HttpGet]
        public IQueryable<SidClient> Clients()
        {
            return _repository.SidClients;
        }

        [HttpGet]
        public IQueryable<SidCardType> SidCardTypes()
        {
            return _repository.SidCardTypes;
        }

        [HttpGet]
        public IQueryable<SidChipType> SidChipTypes()
        {
            return _repository.SidChipTypes;
        }

        [HttpGet]
        public IQueryable<SidClient> SidClients()
        {
            return _repository.SidClients;
        }

        [HttpGet]
        public IQueryable<SidVariant> SidVariants()
        {
            return _repository.SidVariants;
        }

        [HttpGet]
        public IQueryable<SidProduct> SidProducts()
        {
            return _repository.SidProducts.Where(p => p.IsDeleted == false);
        }

        [HttpGet]
        public IQueryable<SidProductImage> SidProductImage(int productId)
        {
            return _repository.SidProductImages.Where(p => p.SidProductId == productId);
        }

        [HttpGet]
        public IQueryable<Remark> Remarks()
        {
            return _repository.Remarks;
        }

        [HttpGet]
        public IQueryable<SidProduct> AllClientProducts()
        {
            return _repository.SidProducts.Where(a => a.IsDeleted == false);
        }
        
        [HttpGet]
        public IQueryable<SidProduct> ClientProducts(int clientId)
        {
            return _repository.SidProducts.Where(a => a.SidClientId == clientId && a.IsDeleted == false);
        }


        [HttpGet]
        public IQueryable<DictionaryClientName> DictionaryClientNames(int clientId)
        {
            return _repository.DictionaryClientNames.Where(a => a.SidClientId == clientId);
        }

        [HttpGet]
        public IQueryable<DictionaryServiceType> DictionaryServiceTypes(int clientId)
        {
            return _repository.DictionaryServiceTypes.Where(a => a.SidClientId == clientId);
        }

        #endregion

        #region MISReports

        [HttpGet]
        public IQueryable<ClientStockReport> StockReports()
        {
            return _repository.ClientStockReports;
        }

        [HttpGet]
        public IQueryable<ClientStockReport> ClientStockReportByClient(int clientId)
        {
            return _repository.ClientStockReports.Include("SidProduct").Where(a => a.SidProduct.SidClientId == clientId);
        }

        [HttpGet]
        public IQueryable<ClientStockReport> ClientStockReportByClientAndCardType(int clientId, int cardTypeId)
        {
            return _repository.ClientStockReports.Include("SidProduct").Where(a => a.SidProduct.SidClientId == clientId);
        }

        [HttpGet]
        public IQueryable<ClientStockLog> ClientStockLogByProductId(int sidProductId)
        {
            return _repository.ClientStockLogs.Include("ClientStockReport").Where(a => a.ClientStockReport.SidProductId == sidProductId);
        }

        [HttpGet]
        public IQueryable<ClientStockLog> ClientStockLogByStockReportId(int stockReportId)
        {
            return _repository.ClientStockLogs.Where(a => a.ClientStockReport.Id == stockReportId);
        }

        [HttpGet]
        public IQueryable<ClientReturnLog> ClientReturnLogByProductId(int sidProductId)
        {
            return _repository.ClientReturnLogs.Include("ClientStockReport").Where(a => a.ClientStockReport.SidProductId == sidProductId);
        }


        //Navigation on Stock

        [HttpGet]
        public IQueryable<CardIssuance> CardIssuanceByStockLog(int stockReportId)
        {
            var stocklog = _repository.ClientStockLogs.Where(a => a.ClientStockReportId == stockReportId);
            return _repository.CardIssuances.Where(b => stocklog.Any(c => c.CardIssuanceId == b.Id));
        }

        [HttpGet]
        public IQueryable<Job> JobByCardIssuanceId(int stockReportId)
        {
            var stocklog = _repository.ClientStockLogs.Where(a => a.ClientStockReportId == stockReportId);
            var cardIssuance = _repository.CardIssuances.Where(b => stocklog.Any(c => c.CardIssuanceId == b.Id));
            return _repository.Jobs.Where(b => cardIssuance.Any(c => c.JobId == b.Id) && b.IsDeleted == false);
        }


        [HttpGet]
        public IQueryable<DispatchDelivery> AllDispatchDelivery()
        {
            return _repository.DispatchDelivery;
        }


        // Issuance
        [HttpGet]
        public IQueryable<CardIssuance> AllCardIssuances()
        {
            return _repository.CardIssuances;
        }

        [HttpGet]
        public IQueryable<CardWasteAnalysis> AllCardWasteAnalysis()
        {
            return _repository.CardWasteAnalysis;
        }

        [HttpGet]
        public IQueryable<PrintWasteAnalysis> AllPrintWasteAnalysis()
        {
            return _repository.PrintWasteAnalysis;
        }


        [HttpGet]
        public IQueryable<DeliveryNote> AllDeliveryNotes()
        {
            return _repository.DeliveryNotes;
        }

        [HttpGet]
        public IQueryable<ClientVaultReport> AllClientVaultReports()
        {
            return _repository.ClientVaultReports;
        }

        [HttpGet]
        public IQueryable<EmbedCardReceipt> AllCardReceiptReports()
        {
            return _repository.EmbedCardReceipts;
        }

        #endregion

        #region FlagJob

        [HttpGet]
        public IQueryable<JobFlag> UnitFlaggedJobs(string unitName)
        {
            var department = _repo.FindDepartmentByName(unitName);
            return _repository.JobFlags.Where(a => a.TargetUnitId == department.Id && a.IsResolved == false);
        }

        [HttpGet]
        public IQueryable<JobFlag> FlaggedJobs()
        {
            return _repository.JobFlags.Where(a => a.IsResolved == false);
        }

        [HttpGet]
        public IQueryable<JobFlag> ResolvedFlaggedJobs()
        {
            return _repository.JobFlags.Where(a => a.IsResolved == true);
        }


        #endregion

        /// <summary>
        /// SuperAdmin Region
        /// </summary>
        /// <returns></returns>

        [HttpGet]
        public IQueryable<ClientUser> ClientUsers(int sidClientId)
        {
            return _repository.ClientUsers.Where(x => x.SidClientId == sidClientId);
        }

        [HttpGet]
        public IQueryable<ApplicationUser> CurrentClientUsers(int sidClientId)
        {
            var users = _repository.Users;
            var clientUsers = _repository.ClientUsers.Where(x => x.SidClientId == sidClientId);
            var results = _repository.Users.Where(a => clientUsers.Any(b => b.UserId == a.Id));
            return results;
        }


        [HttpGet]
        public IQueryable<Job> ClientPendingJobs(int clientId)
        {
            var jobStatus = _repo.FindJobStatusByName("Pending");
            return _repository.Jobs.Where(a => a.JobStatusId == jobStatus.Id && a.SidClientId == clientId && a.IsDeleted == false);
        }

        [HttpGet]
        public IQueryable<Job> ClientCompletedJobs(int clientId)
        {
            var jobStatus = _repo.FindJobStatusByName("Completed");
            return _repository.Jobs.Where(a => a.JobStatusId == jobStatus.Id && a.SidClientId == clientId && a.IsDeleted == false);
        }

        //Todo: Get the client selected product receipts
        [HttpGet]
        public IQueryable<EmbedCardReceipt> ClientEmbedCardReceipts(int clientId)
        {
            return _repository.EmbedCardReceipts.Include("SidProduct").Where(a => a.SidProduct.SidClientId == clientId);
        }

        [HttpGet]
        public IQueryable<ClientStockReport> CustomerStockReports(int clientId)
        {
            return _repository.ClientStockReports.Include("SidProduct").Where(a => a.SidProduct.SidClientId == clientId);
        }


        [HttpGet]
        public IQueryable<DispatchDelivery> ClientDispatchDelivery(int clientId)
        {
            return _repository.DispatchDelivery.Where(a => a.SidClientId == clientId);
        }

        [HttpGet]
        public IQueryable<DeliveryNote> ClientDispatchDeliveryNotes(int clientId)
        {
            return _repository.DeliveryNotes.Where(a => a.SidClientId == clientId);
        }

      

        [HttpGet]
        public object Lookups()
        {
            var departments = _repository.Departments;
            var flagTypes = _repository.FlagTypes;
            var jobStatus = _repository.JobStatus;
            var serviceTypes = _repository.ServiceTypes;
            var remarks = _repository.Remarks;
            var priority = _repository.Priority;
            var vendors = _repository.Vendors;
            var issuanceTypes = _repository.IssuanceTypes;
            var wasteType = _repository.WasteTypes;
            var wasteErrorSources = _repository.WasteErrorSources;
            var wasteErrorSourceCodes = _repository.WasteErrorSourceCodes;

            var sidCardTypes = _repository.SidCardTypes;
            var sidClients = _repository.SidClients;
            var sidSectors = _repository.SidSectors;
            var sidVariants = _repository.SidVariants;
            var chipTypes = _repository.SidChipTypes;
            var sidProducts = _repository.SidProducts.Where(a => a.IsDeleted == false);
            var sidMachines = _repository.SidMachines;
            var deliveryNoteClientTemplate = _repository.DeliveryNoteClientTemplates;
            var deliveryNoteTemplate = _repository.DeliveryNoteTemplates;
            var deliveryProfiles = _repository.DeliveryProfiles;

            var dictionaryClientNames = _repository.DictionaryClientNames;
            var dictionaryCardTypes = _repository.DictionaryCardTypes;
            var dictionaryServiceTypes = _repository.DictionaryServiceTypes;
            var ProductServices = _repository.ProductServices;

            var roles = _repository.Roles;

            return new
            {
                flagTypes,
                serviceTypes,
                jobStatus,
                remarks,
                priority,
                sidCardTypes,
                sidClients,
                sidSectors,
                sidVariants,
                vendors,
                issuanceTypes,
                chipTypes,
                wasteType,
                departments,
                sidProducts,
                sidMachines,
                wasteErrorSources,
                wasteErrorSourceCodes,
                deliveryProfiles,
                roles,
                dictionaryClientNames,
                dictionaryCardTypes,
                dictionaryServiceTypes,
                ProductServices
            };
        }


        [HttpGet]
        public IQueryable<DeliveryNote> TestCOntrol()
        {
            var dispatchList = _repository.DispatchDelivery.Where(a => a.JobTrackerId == 185 && a.IsNoteGenerated == true);
            var total = dispatchList.Sum(a => ((a.RangeTo - a.RangeFrom) + 1));

            return _repository.DeliveryNotes.Where(a => a.CustomerServiceStatus == false);
        }
        
    }
}
