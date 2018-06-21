using Microsoft.AspNet.Identity.EntityFramework;
using SID.Common.Model.Contract;
using SID.Common.Model.Infrastructure;
using SID.Common.Model.Inventory;
using SID.Common.Model.Lookups;
using SID.Common.Model.Production;
using System;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Linq;
using System.Threading.Tasks;

namespace AuthorizationServer.Api.Infrastructure
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext()
            : base("DefaultConnection", throwIfV1Schema: false)
        {
            Configuration.ProxyCreationEnabled = false;
            Configuration.LazyLoadingEnabled = false;

            Configuration.AutoDetectChangesEnabled = true;
        }

        public static ApplicationDbContext Create()
        {
            return new ApplicationDbContext();
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();

            //// Disable proxy creation and lazy loading; not wanted in this service context.
            Configuration.ProxyCreationEnabled = false;
            Configuration.LazyLoadingEnabled = false;

            modelBuilder.Entity<IdentityUserLogin>().HasKey<string>(l => l.UserId);
            modelBuilder.Entity<IdentityRole>().HasKey<string>(r => r.Id);
            modelBuilder.Entity<IdentityUserRole>().HasKey(r => new { r.RoleId, r.UserId });
    
            base.OnModelCreating(modelBuilder);
        }
        
        public DbSet<Audience> Audiences { get; set; }
        public DbSet<Client> Clients { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }

        public DbSet<ClientUser> ClientUsers { get; set; }

        /// <summary>
        /// Lookup Section
        /// </summary>
        /// 

        #region Lookup Section

        public DbSet<Department> Departments { get; set; }
        public DbSet<FlagType> FlagTypes { get; set; }
        public DbSet<JobStatus> JobStatus { get; set; }
        public DbSet<ServiceType> ServiceTypes { get; set; }
        public DbSet<Priority> Priority { get; set; }

        public DbSet<SidCardType> SidCardTypes { get; set; }
        public DbSet<SidChipType> SidChipTypes { get; set; }
        public DbSet<SidClient> SidClients { get; set; }
        public DbSet<SidSector> SidSectors { get; set; }
        public DbSet<SidProduct> SidProducts { get; set; }
        public DbSet<SidProductImage> SidProductImages { get; set; }
        public DbSet<SidMachine> SidMachines { get; set; }
        public DbSet<SidVariant> SidVariants { get; set; }
        public DbSet<ProductService> ProductServices { get; set; }
        public DbSet<Vendor> Vendors { get; set; }
        public DbSet<IssuanceType> IssuanceTypes { get; set; }
        public DbSet<IssuanceStatus> IssuanceStatus { get; set; }

        public DbSet<WasteType> WasteTypes { get; set; }
        public DbSet<DeliveryNoteClientTemplate> DeliveryNoteClientTemplates { get; set; }
        public DbSet<DeliveryNoteTemplate> DeliveryNoteTemplates { get; set; }
        public DbSet<DeliveryProfile> DeliveryProfiles { get; set; }
        public DbSet<WasteErrorSource> WasteErrorSources { get; set; }
        public DbSet<WasteErrorSourceCode> WasteErrorSourceCodes { get; set; }

        public DbSet<DictionaryClientName> DictionaryClientNames { get; set; }
        public DbSet<DictionaryCardType> DictionaryCardTypes { get; set; }
        public DbSet<DictionaryServiceType> DictionaryServiceTypes { get; set; }

        #endregion

        #region Production Section

        public DbSet<CardDelivery> CardDelivery { get; set; }
        public DbSet<CardDeliveryLog> CardDeliveryLogs { get; set; }
        public DbSet<CardWasteAnalysis> CardWasteAnalysis { get; set; }
        public DbSet<PrintWasteAnalysis> PrintWasteAnalysis { get; set; }
        public DbSet<CardHeldAnalysis> CardHeldAnalysis { get; set; }
        public DbSet<PrintHeldAnalysis> PrintHeldAnalysis { get; set; }
        public DbSet<DispatchDelivery> DispatchDelivery { get; set; }
        public DbSet<PrintDelivery> PrintDelivery { get; set; }
        public DbSet<Job> Jobs { get; set; }
        public DbSet<JobSplit> JobSplits { get; set; }
        public DbSet<JobHandler> JobHandlers { get; set; }
        public DbSet<JobSplitCEAnalysis> JobSplitCEAnalysis { get; set; }
        public DbSet<JobSplitPrintCEAnalysis> JobSplitPrintCEAnalysis { get; set; }
        public DbSet<JobFlag> JobFlags { get; set; }
        public DbSet<JobTracker> JobTrackers { get; set; }
        public DbSet<JobVariant> JobVariants { get; set; }
        public DbSet<ServerJobQueue> ServerJobQueues { get; set; }
        public DbSet<Sid01CardOps> Sid01CardOps { get; set; }
        public DbSet<Sid03FirstCard> Sid03FirstCards { get; set; }
        public DbSet<Sid04Printing> Sid04Printings { get; set; }
        public DbSet<Sid06QC> Sid06QCs { get; set; }
        public DbSet<Sid07Mailing> Sid07Mailings { get; set; }
        public DbSet<Sid05QA> Sid05QAs { get; set; }
        public DbSet<Sid08Dispatch> Sid08Dispatchs { get; set; }
        public DbSet<Sid09CustomerService> Sid09CustomerServices { get; set; }
        public DbSet<Remark> Remarks { get; set; }

        #endregion

        #region Inventory

        public DbSet<CardIssuance> CardIssuances { get; set; }
        public DbSet<CardIssuanceLog> CardIssuanceLogs { get; set; }
       
        public DbSet<ClientStockLog> ClientStockLogs { get; set; }
        public DbSet<ClientReturnLog> ClientReturnLogs { get; set; }
        public DbSet<ClientStockReport> ClientStockReports { get; set; }
        public DbSet<ClientVaultReport> ClientVaultReports { get; set; }
        public DbSet<DeliveryNote> DeliveryNotes { get; set; }
        public DbSet<DeliveryNoteLog> DeliveryNoteLogs { get; set; }
        public DbSet<DeliveryNoteMaterialAudit> DeliveryNoteMaterialAudits { get; set; }
        public DbSet<EmbedCardReceipt> EmbedCardReceipts { get; set; }
        public DbSet<EmbedCardRequest> EmbedCardRequests { get; set; }
        public DbSet<StationaryInwardGood> StationaryInwardGoods { get; set; }
        public DbSet<StockStatus> StockStatus { get; set; }
        public DbSet<JobWaste> JobWastes { get; set; }
        public DbSet<JobWasteLog> JobWasteLogs { get; set; }
        public DbSet<WasteDeliveryNote> WasteDeliveryNotes { get; set; }
        public DbSet<WasteDeliveryNoteLog> WasteDeliveryNoteLogs { get; set; }

        public DbSet<NonPersoJob> NonPersoJobs { get; set; }

        #endregion

        private void ApplyRules()
        {
            // Approach via @julielerman: http://bit.ly/123661P
            foreach (var entry in this.ChangeTracker.Entries()
                        .Where(
                             e => e.Entity is IAuditInfo &&
                            (e.State == EntityState.Added) ||
                            (e.State == EntityState.Modified)))
            {
                IAuditInfo e = (IAuditInfo)entry.Entity;

                if (entry.State == EntityState.Added)
                {
                    e.CreatedOn = DateTime.Now;
                }

                e.ModifiedOn = DateTime.Now;
            }
        }

        public override int SaveChanges()
        {
            this.ApplyRules();

            return base.SaveChanges();
        }

        public override async Task<int> SaveChangesAsync()
        {
            //this.ApplyRules();
            return await base.SaveChangesAsync();
        }

    }
}