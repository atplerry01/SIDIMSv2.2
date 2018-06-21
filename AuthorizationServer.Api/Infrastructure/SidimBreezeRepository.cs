using Breeze.ContextProvider.EF6;
using Microsoft.AspNet.Identity.EntityFramework;
using SID.Common.Model.Infrastructure;
using SID.Common.Model.Inventory;
using SID.Common.Model.Lookups;
using SID.Common.Model.Production;
using System.Linq;

namespace AuthorizationServer.Api.Infrastructure
{
    public class SidimBreezeRepository
    {
        private readonly EFContextProvider<ApplicationDbContext>
                      _contextProvider = new EFContextProvider<ApplicationDbContext>();

        private ApplicationDbContext Context { get { return _contextProvider.Context; } }
        
        /// <summary>
        /// Default API End Point
        /// </summary>
        public string Metadata
        {
            get { return _contextProvider.Metadata(); }
        }

        public IQueryable<ApplicationUser> Users
        {
            get { return Context.Users; }
            
        }

        //public IQueryable<IdentityUserRole> UserRoles
        //{
        //    get { return Context.; }

        //}

        public IQueryable<IdentityRole> Roles
        {
            get { return Context.Roles; }
        }

    

        /// <summary>
        /// Unit EndPoint Repository
        /// </summary>
        /// 
        #region Unit EndPoint

        public IQueryable<Sid01CardOps> Sid01CardOps
        {
            get { return Context.Sid01CardOps; }
        }

        public IQueryable<Sid03FirstCard> Sid03FirstCards
        {
            get { return Context.Sid03FirstCards; }
        }

        public IQueryable<Sid04Printing> Sid04Printings
        {
            get { return Context.Sid04Printings; }
        }

        public IQueryable<Sid05QA> Sid05QAs
        {
            get { return Context.Sid05QAs; }
        }

        public IQueryable<Sid06QC> Sid06QCs
        {
            get { return Context.Sid06QCs; }
        }

      
        public IQueryable<DispatchDelivery> DispatchDelivery
        {
            get { return Context.DispatchDelivery; }
        }



        public IQueryable<NonPersoJob> NonPersoJobs
        {
            get { return Context.NonPersoJobs; }
        }

        #endregion



        /// <summary>
        /// Sid Repository
        /// </summary>
    
        public IQueryable<CardDelivery> CardDelivery
        {
            get { return Context.CardDelivery; }
        }

        public IQueryable<CardDeliveryLog> CardDeliveryLogs
        {
            get { return Context.CardDeliveryLogs; }
        }

     
        public IQueryable<ServerJobQueue> ServerJobQueues
        {
            get { return Context.ServerJobQueues; }
        }

        public IQueryable<Job> Jobs
        {
            get { return Context.Jobs; }
        }

        public IQueryable<JobSplit> JobSplits
        {
            get { return Context.JobSplits; }
        }

        public IQueryable<CardWasteAnalysis> CardWasteAnalysis
        {
            get { return Context.CardWasteAnalysis; }
        }

        public IQueryable<PrintWasteAnalysis> PrintWasteAnalysis
        {
            get { return Context.PrintWasteAnalysis; }
        }

        public IQueryable<CardHeldAnalysis> CardHeldAnalysis
        {
            get { return Context.CardHeldAnalysis; }
        }

        public IQueryable<PrintHeldAnalysis> PrintHeldAnalysis
        {
            get { return Context.PrintHeldAnalysis; }
        }

        public IQueryable<JobSplitCEAnalysis> JobSplitCEAnalysis
        {
            get { return Context.JobSplitCEAnalysis; }
        }

    
        public IQueryable<JobSplitPrintCEAnalysis> JobSplitPrintCEAnalysis
        {
            get { return Context.JobSplitPrintCEAnalysis; }
        }

        public IQueryable<JobTracker> JobTrackers
        {
            get { return Context.JobTrackers; }
        }

        public IQueryable<JobHandler> JobHandlers
        {
            get { return Context.JobHandlers; }
        }


        public IQueryable<JobVariant> JobVariants
        {
            get { return Context.JobVariants; }
        }

        public IQueryable<ClientUser> ClientUsers
        {
            get { return Context.ClientUsers; }
        }

        public IQueryable<ProductService> ProductServices
        {
            get { return Context.ProductServices; }
        }


        #region InventorySection

        public IQueryable<CardIssuance> CardIssuances
        {
            get { return Context.CardIssuances; }
        }

        public IQueryable<CardIssuanceLog> CardIssuanceLogs
        {
            get { return Context.CardIssuanceLogs; }
        }

        public IQueryable<ClientStockLog> ClientStockLogs
        {
            get { return Context.ClientStockLogs; }
        }

        public IQueryable<ClientReturnLog> ClientReturnLogs
        {
            get { return Context.ClientReturnLogs; }
        }

        public IQueryable<ClientStockReport> ClientStockReports
        {
            get { return Context.ClientStockReports; }
        }

        public IQueryable<ClientVaultReport> ClientVaultReports
        {
            get { return Context.ClientVaultReports; }
        }

        public IQueryable<DeliveryNote> DeliveryNotes
        {
            get { return Context.DeliveryNotes; }
        }

        public IQueryable<DeliveryNoteLog> DeliveryNoteLogs
        {
            get { return Context.DeliveryNoteLogs; }
        }

        public IQueryable<WasteDeliveryNote> WasteDeliveryNotes
        {
            get { return Context.WasteDeliveryNotes; }
        }

        public IQueryable<WasteDeliveryNoteLog> WasteDeliveryNoteLogs
        {
            get { return Context.WasteDeliveryNoteLogs; }
        }


        public IQueryable<EmbedCardRequest> EmbedCardRequests
        {
            get { return Context.EmbedCardRequests; }
        }

        public IQueryable<EmbedCardReceipt> EmbedCardReceipts
        {
            get { return Context.EmbedCardReceipts; }
        }

        public IQueryable<JobWaste> JobWastes
        {
            get { return Context.JobWastes; }
        }

        public IQueryable<JobWasteLog> JobWasteLogs
        {
            get { return Context.JobWasteLogs; }
        }
        
        public IQueryable<StationaryInwardGood> StationaryInwardGoods
        {
            get { return Context.StationaryInwardGoods; }
        }
        public IQueryable<StockStatus> StockStatus
        {
            get { return Context.StockStatus; }
        }

        public IQueryable<JobFlag> JobFlags
        {
            get { return Context.JobFlags; }
        }



        #endregion


        /// <summary>
        /// Secondary Lookups Repository
        /// </summary>
        /// 
        #region Secondary Lookups Resources Repository

        public IQueryable<WasteErrorSource> WasteErrorSources
        {
            get { return Context.WasteErrorSources; }
        }

        public IQueryable<WasteErrorSourceCode> WasteErrorSourceCodes
        {
            get { return Context.WasteErrorSourceCodes; }
        }

        public IQueryable<Department> Departments
        {
            get { return Context.Departments; }
        }

        public IQueryable<FlagType> FlagTypes
        {
            get { return Context.FlagTypes; }
        }

        public IQueryable<JobStatus> JobStatus
        {
            get { return Context.JobStatus; }
        }

        //public IQueryable<JobTrackerStatus> JobTrackerStatus
        //{
        //    get { return Context.JobTrackerStatus; }
        //}

        public IQueryable<ServiceType> ServiceTypes
        {
            get { return Context.ServiceTypes; }
        }

        //public IQueryable<Status> Status
        //{
        //    get { return Context.Status; }
        //}
        
        public IQueryable<SidCardType> SidCardTypes
        {
            get { return Context.SidCardTypes; }
        }

        public IQueryable<SidChipType> SidChipTypes
        {
            get { return Context.SidChipTypes; }
        }

        public IQueryable<SidClient> SidClients
        {
            get { return Context.SidClients; }
        }

        public IQueryable<SidSector> SidSectors
        {
            get { return Context.SidSectors; }
        }

        public IQueryable<SidVariant> SidVariants
        {
            get { return Context.SidVariants; }
        }

        public IQueryable<SidProduct> SidProducts
        {
            get { return Context.SidProducts; }
        }

        public IQueryable<SidProductImage> SidProductImages
        {
            get { return Context.SidProductImages; }
        }

        public IQueryable<Remark> Remarks
        {
            get { return Context.Remarks; }
        }

        public IQueryable<Priority> Priority
        {
            get { return Context.Priority; }
        }

        public IQueryable<Vendor> Vendors
        {
            get { return Context.Vendors; }
        }

        public IQueryable<IssuanceType> IssuanceTypes
        {
            get { return Context.IssuanceTypes; }
        }

        public IQueryable<WasteType> WasteTypes
        {
            get { return Context.WasteTypes; }
        }
        
        public IQueryable<DeliveryNoteClientTemplate> DeliveryNoteClientTemplates
        {
            get { return Context.DeliveryNoteClientTemplates; }
        }

        public IQueryable<DeliveryNoteTemplate> DeliveryNoteTemplates
        {
            get { return Context.DeliveryNoteTemplates; }
        }

        public IQueryable<DeliveryProfile> DeliveryProfiles
        {
            get { return Context.DeliveryProfiles; }
        }

        public IQueryable<SidMachine> SidMachines
        {
            get { return Context.SidMachines; }
        }
        
        public IQueryable<DictionaryClientName> DictionaryClientNames
        {
            get { return Context.DictionaryClientNames; }
        }

        public IQueryable<DictionaryCardType> DictionaryCardTypes
        {
            get { return Context.DictionaryCardTypes; }
        }

        public IQueryable<DictionaryServiceType> DictionaryServiceTypes
        {
            get { return Context.DictionaryServiceTypes; }
        }

        #endregion


    }
}