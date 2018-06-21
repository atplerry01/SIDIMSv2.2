using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using SID.Common.Model.Infrastructure;
using SID.Common.Model.Inventory;
using SID.Common.Model.Lookups;
using SID.Common.Model.Production;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;

namespace AuthorizationServer.Api.Infrastructure
{
    public class ApplicationRepository : IDisposable
    {
        private ApplicationDbContext _ctx;
        private UserManager<IdentityUser> _userManager;
        private RoleManager<IdentityRole> _roleManager;
        //var roleManager = new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(new ApplicationDbContext()));


        public ApplicationRepository()
        {
            _ctx = new ApplicationDbContext();
            _userManager = new UserManager<IdentityUser>(new UserStore<IdentityUser>(_ctx));
            _roleManager = new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(_ctx));
        }


        public async Task<SidClient> FindSidClientId(int entityId)
        {
            var entity = await _ctx.SidClients.FindAsync(entityId);
            return entity;
        }

        public async Task<ServerJobQueue> FindServerJobQueueById(int entityId)
        {
            var entity = await _ctx.ServerJobQueues.FindAsync(entityId);
            return entity;
        }

        public async Task<NonPersoJob> FindNonPersoJobById(int entityId)
        {
            var entity = await _ctx.NonPersoJobs.FindAsync(entityId);
            return entity;
        }

        public async Task<JobTracker> FindJobTrackerById(int entityId)
        {
            var entity = await _ctx.JobTrackers.FindAsync(entityId);
            return entity;
        }

        public async Task<JobSplitCEAnalysis> FindCEJobAnalysisById(int entityId)
        {
            var entity = await _ctx.JobSplitCEAnalysis.FindAsync(entityId);
            return entity;
        }

        public List<IdentityUserRole> FindUserRoleByRoleName(string roleName)
        {
            var users = _roleManager.FindByName(roleName).Users.ToList();
           return users;
        }

        

        public JobSplitCEAnalysis FindCEJobAnalysisUsingId(int id)
        {
            var entity = _ctx.JobSplitCEAnalysis.Include("JobSplit").FirstOrDefault(a => a.Id == id);
            return entity;
        }

        public JobSplitCEAnalysis FindCEJobAnalysisTrackerId(int id)
        {
            var entity = _ctx.JobSplitCEAnalysis.Include("JobSplit").FirstOrDefault(a => a.JobSplit.JobTrackerId == id);
            return entity;
        }

        public JobSplitPrintCEAnalysis FindPrintCEJobAnalysisTrackerId(int id)
        {
            var entity = _ctx.JobSplitPrintCEAnalysis.Include("JobSplit").FirstOrDefault(a => a.JobSplit.JobTrackerId == id);
            return entity;
        }

        public ServerJobQueue FindServerJobByName(string name)
        {
            var entity = _ctx.ServerJobQueues.FirstOrDefault(a => a.JobName == name);
            return entity;
        }

        public ServiceType FindJobTypeByName(string name)
        {
            var entity = _ctx.ServiceTypes.FirstOrDefault(a => a.Name == name);
            return entity;
        }

        public SidProduct FindClientProductByName(string name)
        {
            var entity = _ctx.SidProducts.FirstOrDefault(a => a.Name == name);
            return entity;
        }

        public JobHandler FindJobHandler(int jobTrackeId, int jobSplitId, string handlerId, string remark)
        {
            var entity = _ctx.JobHandlers.FirstOrDefault(a => a.JobTrackerId == jobTrackeId && a.JobSplitId == jobSplitId && a.HandlerId == handlerId && a.Remark == remark);
            return entity;
        }

        //public CardDelivery FindCardDeliveryByTrackerId(int jobTrackerId)
        //{
        //    var entity = _ctx.CardDelivery.Where(a => a.JobTrackerId == jobTrackerId).FirstOrDefault();
        //    return entity;
        //}

        //public List<CardDelivery> FindCardDeliveryByDepart(int departmentId)
        //{
        //    var entity = _ctx.CardDelivery.Where(a => a.DepartmentId == departmentId).ToList();
        //    return entity;
        //}


        public List<DeliveryNoteLog> FindDeliveryNoteLogByNoteId(int noteId)
        {
            var entity = _ctx.DeliveryNoteLogs.Where(a => a.DeliveryNoteId == noteId).ToList();
            return entity;
        }



        public CardDelivery FindCardDeliveryByTrackerDepart(int trackerId, int departmentId)
        {
            var entity = _ctx.CardDelivery.Where(a => a.JobTrackerId == trackerId && a.DepartmentId == departmentId).FirstOrDefault();
            return entity;
        }

        public List<CardDelivery> FindCardDeliveryByDepartment(int departmentId)
        {
            var entity = _ctx.CardDelivery.Where(a => a.DepartmentId == departmentId).ToList();
            return entity;
        }

        // Lookups Region
        public SidSector FindSectorByName(string name)
        {
            var entity = _ctx.SidSectors.Where(a => a.Name == name).FirstOrDefault();
            return entity;
        }

        public SidClient FindClientByName(string name)
        {
            var entity = _ctx.SidClients.Where(a => a.Name == name).FirstOrDefault();
            return entity;
        }


        public SidCardType FindCardTypeByName(string name)
        {
            var entity = _ctx.SidCardTypes.Where(a => a.Name == name).FirstOrDefault();
            return entity;
        }

        public IssuanceType FindIssuanceTypeByName(string name)
        {
            var entity = _ctx.IssuanceTypes.Where(a => a.Name == name).FirstOrDefault();
            return entity;
        }

        public IssuanceStatus FindIssuanceStatusByName(string name)
        {
            var entity = _ctx.IssuanceStatus.Where(a => a.Name == name).FirstOrDefault();
            return entity;
        }

        public WasteType FindWasteTypeByName(string name)
        {
            var entity = _ctx.WasteTypes.Where(a => a.Name == name).FirstOrDefault();
            return entity;
        }

        public Department FindDepartmentByName(string name)
        {
            var entity = _ctx.Departments.Where(a => a.Name == name).FirstOrDefault();
            return entity;
        }

        public SidMachine FindMachineDepartmentByName(string name)
        {
            var entity = _ctx.SidMachines.Where(a => a.Department.Name == name).FirstOrDefault();
            return entity;
        }

        public JobStatus FindJobStatusByName(string name)
        {
            var entity = _ctx.JobStatus.Where(a => a.Name == name).FirstOrDefault();
            return entity;
        }
        
        //Job Section
        public JobTracker FindJobTrackerByJobId(int id)
        {
            var entity = _ctx.JobTrackers.Where(a => a.JobId == id).FirstOrDefault();
            return entity;
        }

        public JobSplit FindJobSplitByQAProcess(int id)
        {
            var entity = _ctx.JobSplits.Where(a => a.JobTrackerId == id && a.IsQACompleted == false).FirstOrDefault();
            return entity;
        }

        public JobSplit FindPersoJobSplitByQAProcess(int id, int departmentId)
        {
            var entity = _ctx.JobSplits.Where(a => a.JobTrackerId == id && a.IsQACompleted == false && a.DepartmentId == departmentId).FirstOrDefault();
            return entity;
        }


        public JobSplitCEAnalysis FindJobSplitCEJobAnalysisById(int entityId)
        {
            var entity = _ctx.JobSplitCEAnalysis.Where(a => a.Id == entityId).FirstOrDefault();
            return entity;
        }

        public JobSplitPrintCEAnalysis FindJobSplitPrintCEJobAnalysisById(int entityId)
        {
            var entity = _ctx.JobSplitPrintCEAnalysis.Where(a => a.Id == entityId).FirstOrDefault();
            return entity;
        }

        //public JobTrackerStatus FindJobTrackerStatusByName(string name)
        //{
        //    var entity = _ctx.JobTrackerStatus.Where(a => a.Name == name).FirstOrDefault();
        //    return entity;
        //}
        
        #region Inventory

        public CardIssuance FindCardIssuanceByJobId(int id)
        {
            var entity = _ctx.CardIssuances.Where(a => a.JobId == id).Take(1).FirstOrDefault();
            return entity;
        }

        public CardIssuanceLog FindCardIssuanceLogByJobTrackerId(int trackerId)
        {
            var entity = _ctx.CardIssuanceLogs.Where(a => a.JobTrackerId == trackerId).Take(1).FirstOrDefault();
            return entity;
        }

        public List<CardIssuanceLog> FindIssuanceLogByTrackerId(int trackerId)
        {
            var entity = _ctx.CardIssuanceLogs.Where(a => a.JobTrackerId == trackerId && a.IsDeleted == false).ToList();
            return entity;
        }

        public JobVariant FindJobVariantByJobId(int id, int jobTrackerId)
        {
            var entity = _ctx.JobVariants.Where(a => a.JobId == id && a.JobTrackerId == jobTrackerId).Take(1).FirstOrDefault();
            return entity;
        }


        /// <summary>
        /// MIS
        /// </summary>
        public ClientVaultReport FindClientVaultReportBySidProductId(int id)
        {
            var entity = _ctx.ClientVaultReports.Where(a => a.SidProductId == id).Take(1).FirstOrDefault();
            return entity;
        }

        public ClientStockReport FindClientStocktReportBySidProductId(int id, string jobName)
        {
            var entity = _ctx.ClientStockReports.Where(a => a.SidProductId == id && a.FileName == jobName).Take(1).FirstOrDefault();
            return entity;
        }

        public ClientStockReport FindClientStocktReportForTheDay(int id, string jobName)
        {
            var entity = _ctx.ClientStockReports.Where(a => a.SidProductId == id && a.FileName == jobName && DbFunctions.TruncateTime(a.CreatedOn) == DbFunctions.TruncateTime(DateTime.Now)).Take(1).FirstOrDefault();
            return entity;
        }

        //public JobBatchTracker FindBatchTrackerByTrackerId(int jobTrackerId)
        //{
        //    var entity = _ctx.JobBatchTrackers.Where(a => a.JobTrackerId == jobTrackerId).Take(1).FirstOrDefault();
        //    return entity;
        //}


        #endregion
        
        public List<DispatchDelivery> FindNoteGeneratedDispatchDeliveryByTrackerId(int trackerId)
        {
            var entity = _ctx.DispatchDelivery.Where(a => a.JobTrackerId == trackerId && a.IsNoteGenerated == true).ToList();
            return entity;
        }


        public void Dispose()
        {
            _ctx.Dispose();
            _userManager.Dispose();

        }

    }
}