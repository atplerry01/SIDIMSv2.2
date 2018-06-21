namespace AuthorizationServer.Api.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class InitialMigrations : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Audience",
                c => new
                    {
                        ClientId = c.String(nullable: false, maxLength: 32),
                        Base64Secret = c.String(nullable: false, maxLength: 80),
                        Name = c.String(nullable: false, maxLength: 100),
                    })
                .PrimaryKey(t => t.ClientId);
            
            CreateTable(
                "dbo.CardDelivery",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        JobTrackerId = c.Int(nullable: false),
                        DepartmentId = c.Int(nullable: false),
                        TargetDepartmentId = c.Int(nullable: false),
                        TotalQuantity = c.Int(nullable: false),
                        TotalHeld = c.Int(nullable: false),
                        TotalWaste = c.Int(nullable: false),
                        DeliveredById = c.String(maxLength: 128),
                        DeliveredOn = c.DateTime(nullable: false),
                        ConfirmedById = c.String(maxLength: 128),
                        ConfirmedOn = c.DateTime(nullable: false),
                        IsCompleted = c.Boolean(nullable: false),
                        Remark = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.ConfirmedById)
                .ForeignKey("dbo.AspNetUsers", t => t.DeliveredById)
                .ForeignKey("dbo.Department", t => t.DepartmentId, cascadeDelete: true)
                .ForeignKey("dbo.JobTracker", t => t.JobTrackerId, cascadeDelete: true)
                .ForeignKey("dbo.Department", t => t.TargetDepartmentId, cascadeDelete: false)
                .Index(t => t.JobTrackerId)
                .Index(t => t.DepartmentId)
                .Index(t => t.TargetDepartmentId)
                .Index(t => t.DeliveredById)
                .Index(t => t.ConfirmedById);
            
            CreateTable(
                "dbo.AspNetUsers",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        FirstName = c.String(nullable: false, maxLength: 100),
                        LastName = c.String(nullable: false, maxLength: 100),
                        MiddleName = c.String(),
                        Nickname = c.String(),
                        Suffix = c.String(),
                        Level = c.Byte(nullable: false),
                        JoinDate = c.DateTime(nullable: false),
                        Title = c.String(),
                        EmailSignature = c.String(),
                        Photo = c.String(),
                        ProfilePicture = c.String(),
                        ProfileIsVisible = c.String(),
                        UserLanguagekey = c.String(),
                        EnableMobileApp = c.String(),
                        EnableOfflineUser = c.String(),
                        Status = c.String(),
                        IsDeleted = c.Boolean(nullable: false),
                        IsFrozen = c.Boolean(nullable: false),
                        Email = c.String(maxLength: 256),
                        EmailConfirmed = c.Boolean(nullable: false),
                        PasswordHash = c.String(),
                        SecurityStamp = c.String(),
                        PhoneNumber = c.String(),
                        PhoneNumberConfirmed = c.Boolean(nullable: false),
                        TwoFactorEnabled = c.Boolean(nullable: false),
                        LockoutEndDateUtc = c.DateTime(),
                        LockoutEnabled = c.Boolean(nullable: false),
                        AccessFailedCount = c.Int(nullable: false),
                        UserName = c.String(nullable: false, maxLength: 256),
                    })
                .PrimaryKey(t => t.Id)
                .Index(t => t.UserName, unique: true, name: "UserNameIndex");
            
            CreateTable(
                "dbo.AspNetUserClaims",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserId = c.String(nullable: false, maxLength: 128),
                        ClaimType = c.String(),
                        ClaimValue = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.AspNetUserLogins",
                c => new
                    {
                        LoginProvider = c.String(nullable: false, maxLength: 128),
                        ProviderKey = c.String(nullable: false, maxLength: 128),
                        UserId = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.LoginProvider, t.ProviderKey, t.UserId })
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.AspNetUserRoles",
                c => new
                    {
                        UserId = c.String(nullable: false, maxLength: 128),
                        RoleId = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.UserId, t.RoleId })
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .ForeignKey("dbo.AspNetRoles", t => t.RoleId, cascadeDelete: true)
                .Index(t => t.UserId)
                .Index(t => t.RoleId);
            
            CreateTable(
                "dbo.Department",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.JobTracker",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        JobId = c.Int(nullable: false),
                        CardOpsId = c.Int(nullable: false),
                        InventoryId = c.Int(nullable: false),
                        PrintingId = c.Int(nullable: false),
                        PrintQAId = c.Int(nullable: false),
                        PrintQCId = c.Int(nullable: false),
                        CardEngrId = c.Int(nullable: false),
                        QAId = c.Int(nullable: false),
                        FirstJobRunId = c.Int(nullable: false),
                        CardEngrResumeId = c.Int(nullable: false),
                        QCId = c.Int(nullable: false),
                        MailingId = c.Int(nullable: false),
                        DispatchId = c.Int(nullable: false),
                        MAudId = c.Int(nullable: false),
                        CustomerServiceId = c.Int(nullable: false),
                        JobStatusId = c.Int(nullable: false),
                        TAT = c.Single(nullable: false),
                        IsPartial = c.Boolean(nullable: false),
                        IsFlag = c.Boolean(nullable: false),
                        IsCompleted = c.Boolean(nullable: false),
                        IsDeleted = c.Boolean(nullable: false),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Job", t => t.JobId, cascadeDelete: true)
                .ForeignKey("dbo.JobStatus", t => t.JobStatusId, cascadeDelete: true)
                .ForeignKey("dbo.JobStatus", t => t.CardOpsId, cascadeDelete: false)
                .ForeignKey("dbo.JobStatus", t => t.InventoryId, cascadeDelete: false)
                .ForeignKey("dbo.JobStatus", t => t.PrintingId, cascadeDelete: false)
                .ForeignKey("dbo.JobStatus", t => t.PrintQAId, cascadeDelete: false)
                .ForeignKey("dbo.JobStatus", t => t.PrintQCId, cascadeDelete: false)
                .ForeignKey("dbo.JobStatus", t => t.CardEngrId, cascadeDelete: false)
                .ForeignKey("dbo.JobStatus", t => t.QAId, cascadeDelete: false)
                .ForeignKey("dbo.JobStatus", t => t.FirstJobRunId, cascadeDelete: false)
                .ForeignKey("dbo.JobStatus", t => t.CardEngrResumeId, cascadeDelete: false)
                .ForeignKey("dbo.JobStatus", t => t.QCId, cascadeDelete: false)
                .ForeignKey("dbo.JobStatus", t => t.MailingId, cascadeDelete: false)
                .ForeignKey("dbo.JobStatus", t => t.DispatchId, cascadeDelete: false)
                .ForeignKey("dbo.JobStatus", t => t.MAudId, cascadeDelete: false)
                .ForeignKey("dbo.JobStatus", t => t.CustomerServiceId, cascadeDelete: false)
                .Index(t => t.JobId)
                .Index(t => t.CardOpsId)
                .Index(t => t.InventoryId)
                .Index(t => t.PrintingId)
                .Index(t => t.PrintQAId)
                .Index(t => t.PrintQCId)
                .Index(t => t.CardEngrId)
                .Index(t => t.QAId)
                .Index(t => t.FirstJobRunId)
                .Index(t => t.CardEngrResumeId)
                .Index(t => t.QCId)
                .Index(t => t.MailingId)
                .Index(t => t.DispatchId)
                .Index(t => t.MAudId)
                .Index(t => t.CustomerServiceId)
                .Index(t => t.JobStatusId);
            
            CreateTable(
                "dbo.Job",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        JobName = c.String(),
                        SidClientId = c.Int(nullable: false),
                        RemarkId = c.Int(),
                        ServiceTypeId = c.Int(),
                        SidCardTypeId = c.Int(nullable: false),
                        JobStatusId = c.Int(nullable: false),
                        IsJobPartial = c.Boolean(nullable: false),
                        Quantity = c.Int(nullable: false),
                        SortingFile = c.Boolean(nullable: false),
                        IsDeleted = c.Boolean(nullable: false),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.JobStatus", t => t.JobStatusId, cascadeDelete: false)
                .ForeignKey("dbo.Remark", t => t.RemarkId)
                .ForeignKey("dbo.ServiceType", t => t.ServiceTypeId)
                .ForeignKey("dbo.SidCardType", t => t.SidCardTypeId, cascadeDelete: true)
                .ForeignKey("dbo.SidClient", t => t.SidClientId, cascadeDelete: true)
                .Index(t => t.SidClientId)
                .Index(t => t.RemarkId)
                .Index(t => t.ServiceTypeId)
                .Index(t => t.SidCardTypeId)
                .Index(t => t.JobStatusId);
            
            CreateTable(
                "dbo.JobStatus",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Remark",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        SidClientId = c.Int(nullable: false),
                        Name = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.SidClient", t => t.SidClientId, cascadeDelete: true)
                .Index(t => t.SidClientId);
            
            CreateTable(
                "dbo.SidClient",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        SectorId = c.Int(nullable: false),
                        Name = c.String(),
                        ShortCode = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.SidSector", t => t.SectorId, cascadeDelete: true)
                .Index(t => t.SectorId);
            
            CreateTable(
                "dbo.SidSector",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.ServiceType",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.SidCardType",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.CardDeliveryLog",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        JobTrackerId = c.Int(nullable: false),
                        CardDeliveryId = c.Int(nullable: false),
                        RangeFrom = c.Int(nullable: false),
                        RangeTo = c.Int(nullable: false),
                        IsConfirmed = c.Boolean(nullable: false),
                        IsDeleted = c.Boolean(nullable: false),
                        CreatedById = c.String(maxLength: 128),
                        CreatedOn = c.DateTime(nullable: false),
                        ConfirmedById = c.String(maxLength: 128),
                        ConfirmedOn = c.DateTime(nullable: false),
                        Description = c.String(),
                        BoxQty = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.CardDelivery", t => t.CardDeliveryId, cascadeDelete: true)
                .ForeignKey("dbo.AspNetUsers", t => t.ConfirmedById)
                .ForeignKey("dbo.AspNetUsers", t => t.CreatedById)
                .ForeignKey("dbo.JobTracker", t => t.JobTrackerId, cascadeDelete: false)
                .Index(t => t.JobTrackerId)
                .Index(t => t.CardDeliveryId)
                .Index(t => t.CreatedById)
                .Index(t => t.ConfirmedById);
            
            CreateTable(
                "dbo.CardHeldAnalysis",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        JobTrackerId = c.Int(nullable: false),
                        JobSplitId = c.Int(nullable: false),
                        JobSplitCEAnalysisId = c.Int(nullable: false),
                        QuantityHeld = c.Int(nullable: false),
                        WasteErrorSourceId = c.Int(nullable: false),
                        WasteByUnitId = c.Int(nullable: false),
                        IsCardCollected = c.Boolean(nullable: false),
                        CreatedById = c.String(maxLength: 128),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedById = c.String(maxLength: 128),
                        ModifiedOn = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.CreatedById)
                .ForeignKey("dbo.JobSplit", t => t.JobSplitId, cascadeDelete: true)
                .ForeignKey("dbo.JobTracker", t => t.JobTrackerId, cascadeDelete: true)
                .ForeignKey("dbo.AspNetUsers", t => t.ModifiedById)
                .ForeignKey("dbo.Department", t => t.WasteByUnitId, cascadeDelete: true)
                .Index(t => t.JobTrackerId)
                .Index(t => t.JobSplitId)
                .Index(t => t.WasteByUnitId)
                .Index(t => t.CreatedById)
                .Index(t => t.ModifiedById);
            
            CreateTable(
                "dbo.JobSplit",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        JobTrackerId = c.Int(nullable: false),
                        DepartmentId = c.Int(nullable: false),
                        SidMachineId = c.Int(nullable: false),
                        RangeFrom = c.Int(nullable: false),
                        RangeTo = c.Int(nullable: false),
                        IsQACompleted = c.Boolean(nullable: false),
                        IsCECompleted = c.Boolean(nullable: false),
                        IsQCCompleted = c.Boolean(nullable: false),
                        IsMACompleted = c.Boolean(nullable: false),
                        CreatedById = c.String(maxLength: 128),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.CreatedById)
                .ForeignKey("dbo.Department", t => t.DepartmentId, cascadeDelete: false)
                .ForeignKey("dbo.JobTracker", t => t.JobTrackerId, cascadeDelete: false)
                .ForeignKey("dbo.SidMachine", t => t.SidMachineId, cascadeDelete: false)
                .Index(t => t.JobTrackerId)
                .Index(t => t.DepartmentId)
                .Index(t => t.SidMachineId)
                .Index(t => t.CreatedById);
            
            CreateTable(
                "dbo.SidMachine",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        DepartmentId = c.Int(nullable: false),
                        Name = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Department", t => t.DepartmentId, cascadeDelete: false)
                .Index(t => t.DepartmentId);
            
            CreateTable(
                "dbo.CardIssuanceLog",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        CardIssuanceId = c.Int(nullable: false),
                        JobTrackerId = c.Int(nullable: false),
                        IssuanceTypeId = c.Int(nullable: false),
                        TotalQuantity = c.Int(nullable: false),
                        QuantityIssued = c.Int(nullable: false),
                        QuantityRemain = c.Int(nullable: false),
                        IssuanceId = c.String(maxLength: 128),
                        CollectorId = c.String(maxLength: 128),
                        IsDeleted = c.Boolean(nullable: false),
                        IssuedDate = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.CardIssuance", t => t.CardIssuanceId, cascadeDelete: true)
                .ForeignKey("dbo.AspNetUsers", t => t.CollectorId)
                .ForeignKey("dbo.AspNetUsers", t => t.IssuanceId)
                .ForeignKey("dbo.IssuanceType", t => t.IssuanceTypeId, cascadeDelete: true)
                .ForeignKey("dbo.JobTracker", t => t.JobTrackerId, cascadeDelete: true)
                .Index(t => t.CardIssuanceId)
                .Index(t => t.JobTrackerId)
                .Index(t => t.IssuanceTypeId)
                .Index(t => t.IssuanceId)
                .Index(t => t.CollectorId);
            
            CreateTable(
                "dbo.CardIssuance",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        JobId = c.Int(nullable: false),
                        TotalQuantity = c.Int(nullable: false),
                        TotalQuantityIssued = c.Int(nullable: false),
                        TotalQuantityRemain = c.Int(nullable: false),
                        TotalWaste = c.Int(nullable: false),
                        TotalHeld = c.Int(nullable: false),
                        IssuanceId = c.String(maxLength: 128),
                        CollectorId = c.String(maxLength: 128),
                        IssuanceStatusId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.CollectorId)
                .ForeignKey("dbo.AspNetUsers", t => t.IssuanceId)
                .ForeignKey("dbo.Job", t => t.JobId, cascadeDelete: false)
                .Index(t => t.JobId)
                .Index(t => t.IssuanceId)
                .Index(t => t.CollectorId);
            
            CreateTable(
                "dbo.IssuanceType",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.CardWasteAnalysis",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        JobTrackerId = c.Int(nullable: false),
                        JobSplitId = c.Int(nullable: false),
                        JobSplitCEAnalysisId = c.Int(nullable: false),
                        QuantityBad = c.Int(nullable: false),
                        WasteErrorSourceId = c.Int(nullable: false),
                        WasteByUnitId = c.Int(nullable: false),
                        IsCardCollected = c.Boolean(nullable: false),
                        CreatedById = c.String(maxLength: 128),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedById = c.String(maxLength: 128),
                        ModifiedOn = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.CreatedById)
                .ForeignKey("dbo.JobSplit", t => t.JobSplitId, cascadeDelete: false)
                .ForeignKey("dbo.JobSplitCEAnalysis", t => t.JobSplitCEAnalysisId, cascadeDelete: true)
                .ForeignKey("dbo.JobTracker", t => t.JobTrackerId, cascadeDelete: false)
                .ForeignKey("dbo.AspNetUsers", t => t.ModifiedById)
                .ForeignKey("dbo.Department", t => t.WasteByUnitId, cascadeDelete: true)
                .ForeignKey("dbo.WasteErrorSource", t => t.WasteErrorSourceId, cascadeDelete: true)
                .Index(t => t.JobTrackerId)
                .Index(t => t.JobSplitId)
                .Index(t => t.JobSplitCEAnalysisId)
                .Index(t => t.WasteErrorSourceId)
                .Index(t => t.WasteByUnitId)
                .Index(t => t.CreatedById)
                .Index(t => t.ModifiedById);
            
            CreateTable(
                "dbo.JobSplitCEAnalysis",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        JobTrackerId = c.Int(nullable: false),
                        JobSplitId = c.Int(nullable: false),
                        QuantityGood = c.Int(nullable: false),
                        QuantityHeld = c.Int(nullable: false),
                        QuantityBad = c.Int(nullable: false),
                        ConfirmedHeld = c.Int(nullable: false),
                        IsCEInitialized = c.Boolean(nullable: false),
                        IsQCInitialized = c.Boolean(nullable: false),
                        HeldReturned = c.Int(nullable: false),
                        WasteReturned = c.Int(nullable: false),
                        CreatedById = c.String(maxLength: 128),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedById = c.String(maxLength: 128),
                        ModifiedOn = c.DateTime(nullable: false),
                        IsJobHandleByCE = c.Boolean(nullable: false),
                        IsJobHandleByQC = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.CreatedById)
                .ForeignKey("dbo.JobSplit", t => t.JobSplitId, cascadeDelete: true)
                .ForeignKey("dbo.JobTracker", t => t.JobTrackerId, cascadeDelete: true)
                .ForeignKey("dbo.AspNetUsers", t => t.ModifiedById)
                .Index(t => t.JobTrackerId)
                .Index(t => t.JobSplitId)
                .Index(t => t.CreatedById)
                .Index(t => t.ModifiedById);
            
            CreateTable(
                "dbo.WasteErrorSource",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.ClientReturnLog",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ClientStockReportId = c.Int(nullable: false),
                        IssuanceQty = c.Int(nullable: false),
                        OpeningStock = c.Int(nullable: false),
                        ClosingStock = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.ClientStockReport", t => t.ClientStockReportId, cascadeDelete: true)
                .Index(t => t.ClientStockReportId);
            
            CreateTable(
                "dbo.ClientStockReport",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        SidProductId = c.Int(nullable: false),
                        ClientVaultReportId = c.Int(nullable: false),
                        FileName = c.String(),
                        QtyIssued = c.Int(nullable: false),
                        TotalQtyIssued = c.Int(nullable: false),
                        WasteQty = c.Int(nullable: false),
                        ReturnQty = c.Int(nullable: false),
                        OpeningStock = c.Int(nullable: false),
                        ClosingStock = c.Int(nullable: false),
                        CreatedOn = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.ClientVaultReport", t => t.ClientVaultReportId, cascadeDelete: true)
                .ForeignKey("dbo.SidProduct", t => t.SidProductId, cascadeDelete: true)
                .Index(t => t.SidProductId)
                .Index(t => t.ClientVaultReportId);
            
            CreateTable(
                "dbo.ClientVaultReport",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        SidProductId = c.Int(nullable: false),
                        OpeningStock = c.Int(nullable: false),
                        ClosingStock = c.Int(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.SidProduct", t => t.SidProductId, cascadeDelete: false)
                .Index(t => t.SidProductId);
            
            CreateTable(
                "dbo.SidProduct",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        SidClientId = c.Int(nullable: false),
                        SidCardTypeId = c.Int(nullable: false),
                        Variant = c.String(),
                        Name = c.String(),
                        ShortCode = c.String(),
                        IsDeleted = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.SidCardType", t => t.SidCardTypeId, cascadeDelete: true)
                .ForeignKey("dbo.SidClient", t => t.SidClientId, cascadeDelete: true)
                .Index(t => t.SidClientId)
                .Index(t => t.SidCardTypeId);
            
            CreateTable(
                "dbo.Client",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        Secret = c.String(nullable: false),
                        Name = c.String(nullable: false, maxLength: 100),
                        ApplicationType = c.Int(nullable: false),
                        Active = c.Boolean(nullable: false),
                        RefreshTokenLifeTime = c.Int(nullable: false),
                        AllowedOrigin = c.String(maxLength: 100),
                        IsPublic = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.ClientStockLog",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ClientStockReportId = c.Int(nullable: false),
                        CardIssuanceId = c.Int(nullable: false),
                        IssuanceQty = c.Int(nullable: false),
                        OpeningStock = c.Int(nullable: false),
                        ClosingStock = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.CardIssuance", t => t.CardIssuanceId, cascadeDelete: true)
                .ForeignKey("dbo.ClientStockReport", t => t.ClientStockReportId, cascadeDelete: true)
                .Index(t => t.ClientStockReportId)
                .Index(t => t.CardIssuanceId);
            
            CreateTable(
                "dbo.ClientUser",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        SidClientId = c.Int(nullable: false),
                        UserId = c.String(maxLength: 128),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.SidClient", t => t.SidClientId, cascadeDelete: true)
                .ForeignKey("dbo.AspNetUsers", t => t.UserId)
                .Index(t => t.SidClientId)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.DeliveryNoteClientTemplate",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        DeliveryNoteId = c.Int(nullable: false),
                        DeliveryNoteTemplateId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.DeliveryNoteTemplate", t => t.DeliveryNoteTemplateId, cascadeDelete: true)
                .ForeignKey("dbo.DeliveryProfile", t => t.DeliveryNoteId, cascadeDelete: true)
                .Index(t => t.DeliveryNoteId)
                .Index(t => t.DeliveryNoteTemplateId);
            
            CreateTable(
                "dbo.DeliveryNoteTemplate",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.DeliveryProfile",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        SidClientId = c.Int(nullable: false),
                        Name = c.String(),
                        Address = c.String(),
                        State = c.String(),
                        Country = c.String(),
                        ContactPerson = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.DeliveryNoteLog",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        DispatchDeliveryId = c.Int(nullable: false),
                        DeliveryNoteId = c.Int(nullable: false),
                        JobTrackerId = c.Int(nullable: false),
                        QuantityReceived = c.Int(nullable: false),
                        PreviousDelivery = c.Int(nullable: false),
                        QuantityDelivered = c.Int(nullable: false),
                        Ommitted = c.Int(nullable: false),
                        Pending = c.Int(nullable: false),
                        IsPartial = c.Boolean(nullable: false),
                        AuditStatus = c.Boolean(nullable: false),
                        CustomerServiceStatus = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.DeliveryNote", t => t.DeliveryNoteId, cascadeDelete: true)
                .ForeignKey("dbo.DispatchDelivery", t => t.DispatchDeliveryId, cascadeDelete: true)
                .ForeignKey("dbo.JobTracker", t => t.JobTrackerId, cascadeDelete: true)
                .Index(t => t.DispatchDeliveryId)
                .Index(t => t.DeliveryNoteId)
                .Index(t => t.JobTrackerId);
            
            CreateTable(
                "dbo.DeliveryNote",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        SidClientId = c.Int(nullable: false),
                        DeliveryProfileId = c.Int(nullable: false),
                        HasTemplate = c.Boolean(nullable: false),
                        Description = c.String(),
                        CreatedById = c.String(maxLength: 128),
                        TransactionDate = c.DateTime(nullable: false),
                        AuditStatus = c.Boolean(nullable: false),
                        CustomerServiceStatus = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.CreatedById)
                .ForeignKey("dbo.DeliveryProfile", t => t.DeliveryProfileId, cascadeDelete: true)
                .ForeignKey("dbo.SidClient", t => t.SidClientId, cascadeDelete: false)
                .Index(t => t.SidClientId)
                .Index(t => t.DeliveryProfileId)
                .Index(t => t.CreatedById);
            
            CreateTable(
                "dbo.DispatchDelivery",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        SidClientId = c.Int(nullable: false),
                        JobTrackerId = c.Int(nullable: false),
                        IsNoteGenerated = c.Boolean(nullable: false),
                        RangeFrom = c.Int(nullable: false),
                        RangeTo = c.Int(nullable: false),
                        CreatedById = c.String(maxLength: 128),
                        CreatedOn = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.CreatedById)
                .ForeignKey("dbo.JobTracker", t => t.JobTrackerId, cascadeDelete: false)
                .ForeignKey("dbo.SidClient", t => t.SidClientId, cascadeDelete: false)
                .Index(t => t.SidClientId)
                .Index(t => t.JobTrackerId)
                .Index(t => t.CreatedById);
            
            CreateTable(
                "dbo.DeliveryNoteMaterialAudit",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        DeliveryNoteId = c.Int(nullable: false),
                        AssignedDriverId = c.String(maxLength: 128),
                        CreatedById = c.String(maxLength: 128),
                        CreatedOn = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.AssignedDriverId)
                .ForeignKey("dbo.AspNetUsers", t => t.CreatedById)
                .Index(t => t.AssignedDriverId)
                .Index(t => t.CreatedById);
            
            CreateTable(
                "dbo.DictionaryCardType",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        SidCardTypeId = c.Int(nullable: false),
                        CardCodeName = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.SidCardType", t => t.SidCardTypeId, cascadeDelete: true)
                .Index(t => t.SidCardTypeId);
            
            CreateTable(
                "dbo.DictionaryClientName",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        SidClientId = c.Int(nullable: false),
                        ClientCodeName = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.SidClient", t => t.SidClientId, cascadeDelete: true)
                .Index(t => t.SidClientId);
            
            CreateTable(
                "dbo.DictionaryServiceType",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        SidClientId = c.Int(nullable: false),
                        SidCardTypeId = c.Int(nullable: false),
                        ServiceTypeId = c.Int(nullable: false),
                        ServiceCodeName = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.ServiceType", t => t.ServiceTypeId, cascadeDelete: true)
                .ForeignKey("dbo.SidCardType", t => t.SidCardTypeId, cascadeDelete: true)
                .ForeignKey("dbo.SidClient", t => t.SidClientId, cascadeDelete: true)
                .Index(t => t.SidClientId)
                .Index(t => t.SidCardTypeId)
                .Index(t => t.ServiceTypeId);
            
            CreateTable(
                "dbo.EmbedCardReceipt",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        SidProductId = c.Int(nullable: false),
                        EmbedCardRequestId = c.Int(nullable: false),
                        ClientVaultReportId = c.Int(nullable: false),
                        VendorId = c.Int(nullable: false),
                        SIDReceiverId = c.String(maxLength: 128),
                        SupplierName = c.String(),
                        LotNumber = c.String(),
                        Quantity = c.Int(nullable: false),
                        TimeOfReceipt = c.DateTime(nullable: false),
                        Remark = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.EmbedCardRequest", t => t.EmbedCardRequestId, cascadeDelete: true)
                .ForeignKey("dbo.SidProduct", t => t.SidProductId, cascadeDelete: true)
                .ForeignKey("dbo.AspNetUsers", t => t.SIDReceiverId)
                .ForeignKey("dbo.Vendor", t => t.VendorId, cascadeDelete: true)
                .Index(t => t.SidProductId)
                .Index(t => t.EmbedCardRequestId)
                .Index(t => t.VendorId)
                .Index(t => t.SIDReceiverId);
            
            CreateTable(
                "dbo.EmbedCardRequest",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        SidProductId = c.Int(nullable: false),
                        OrderNumber = c.Int(),
                        TotalBatchQty = c.Int(nullable: false),
                        TotalDelivered = c.Int(nullable: false),
                        CreatedById = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.CreatedById)
                .ForeignKey("dbo.SidProduct", t => t.SidProductId, cascadeDelete: false)
                .Index(t => t.SidProductId)
                .Index(t => t.CreatedById);
            
            CreateTable(
                "dbo.Vendor",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.FlagType",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.IssuanceStatus",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.JobFlag",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        JobTrackerId = c.Int(nullable: false),
                        FlagTypeId = c.Int(nullable: false),
                        TargetUnitId = c.Int(nullable: false),
                        Description = c.String(),
                        Recommendation = c.String(),
                        ResolvedById = c.String(maxLength: 128),
                        CreatedById = c.String(maxLength: 128),
                        ModifiedById = c.String(maxLength: 128),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                        IsResolved = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.CreatedById)
                .ForeignKey("dbo.FlagType", t => t.FlagTypeId, cascadeDelete: true)
                .ForeignKey("dbo.JobTracker", t => t.JobTrackerId, cascadeDelete: true)
                .ForeignKey("dbo.AspNetUsers", t => t.ModifiedById)
                .ForeignKey("dbo.AspNetUsers", t => t.ResolvedById)
                .ForeignKey("dbo.Department", t => t.TargetUnitId, cascadeDelete: true)
                .Index(t => t.JobTrackerId)
                .Index(t => t.FlagTypeId)
                .Index(t => t.TargetUnitId)
                .Index(t => t.ResolvedById)
                .Index(t => t.CreatedById)
                .Index(t => t.ModifiedById);
            
            CreateTable(
                "dbo.JobHandler",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        JobTrackerId = c.Int(nullable: false),
                        JobSplitId = c.Int(nullable: false),
                        HandlerId = c.String(maxLength: 128),
                        Remark = c.String(),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.HandlerId)
                .ForeignKey("dbo.JobSplit", t => t.JobSplitId, cascadeDelete: true)
                .ForeignKey("dbo.JobTracker", t => t.JobTrackerId, cascadeDelete: true)
                .Index(t => t.JobTrackerId)
                .Index(t => t.JobSplitId)
                .Index(t => t.HandlerId);
            
            CreateTable(
                "dbo.JobSplitPrintCEAnalysis",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        JobTrackerId = c.Int(nullable: false),
                        JobSplitId = c.Int(nullable: false),
                        QuantityGood = c.Int(nullable: false),
                        QuantityHeld = c.Int(nullable: false),
                        QuantityBad = c.Int(nullable: false),
                        ConfirmedHeld = c.Int(nullable: false),
                        IsCEInitialized = c.Boolean(nullable: false),
                        IsQCInitialized = c.Boolean(nullable: false),
                        HeldReturned = c.Int(nullable: false),
                        WasteReturned = c.Int(nullable: false),
                        CreatedById = c.String(maxLength: 128),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedById = c.String(maxLength: 128),
                        ModifiedOn = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.CreatedById)
                .ForeignKey("dbo.JobSplit", t => t.JobSplitId, cascadeDelete: true)
                .ForeignKey("dbo.JobTracker", t => t.JobTrackerId, cascadeDelete: true)
                .ForeignKey("dbo.AspNetUsers", t => t.ModifiedById)
                .Index(t => t.JobTrackerId)
                .Index(t => t.JobSplitId)
                .Index(t => t.CreatedById)
                .Index(t => t.ModifiedById);
            
            CreateTable(
                "dbo.JobVariant",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        JobId = c.Int(nullable: false),
                        JobTrackerId = c.Int(nullable: false),
                        SidProductId = c.Int(nullable: false),
                        ServiceTypeId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Job", t => t.JobId, cascadeDelete: true)
                .ForeignKey("dbo.JobTracker", t => t.JobTrackerId, cascadeDelete: false)
                .ForeignKey("dbo.ServiceType", t => t.ServiceTypeId, cascadeDelete: true)
                .ForeignKey("dbo.SidProduct", t => t.SidProductId, cascadeDelete: false)
                .Index(t => t.JobId)
                .Index(t => t.JobTrackerId)
                .Index(t => t.SidProductId)
                .Index(t => t.ServiceTypeId);
            
            CreateTable(
                "dbo.JobWasteLog",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        JobId = c.Int(nullable: false),
                        WasteTypeId = c.Int(nullable: false),
                        DepartmentId = c.Int(nullable: false),
                        WasteQuantity = c.Int(nullable: false),
                        CreatedById = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.CreatedById)
                .ForeignKey("dbo.Job", t => t.JobId, cascadeDelete: true)
                .ForeignKey("dbo.WasteType", t => t.WasteTypeId, cascadeDelete: true)
                .Index(t => t.JobId)
                .Index(t => t.WasteTypeId)
                .Index(t => t.CreatedById);
            
            CreateTable(
                "dbo.WasteType",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.JobWaste",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        JobId = c.Int(nullable: false),
                        WasteTypeId = c.Int(nullable: false),
                        DepartmentId = c.Int(nullable: false),
                        TotalWasteQuantity = c.Int(nullable: false),
                        PendingWasteQuantity = c.Int(nullable: false),
                        CreatedById = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.CreatedById)
                .ForeignKey("dbo.Department", t => t.DepartmentId, cascadeDelete: true)
                .ForeignKey("dbo.Job", t => t.JobId, cascadeDelete: true)
                .ForeignKey("dbo.WasteType", t => t.WasteTypeId, cascadeDelete: true)
                .Index(t => t.JobId)
                .Index(t => t.WasteTypeId)
                .Index(t => t.DepartmentId)
                .Index(t => t.CreatedById);
            
            CreateTable(
                "dbo.NonPersoJob",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        SidProductId = c.Int(nullable: false),
                        ServiceTypeId = c.Int(nullable: false),
                        Quantity = c.Int(nullable: false),
                        JobName = c.String(),
                        Description = c.String(),
                        IsTreated = c.Boolean(nullable: false),
                        IsDeleted = c.Boolean(nullable: false),
                        CreatedById = c.String(maxLength: 128),
                        ModifiedById = c.String(maxLength: 128),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.CreatedById)
                .ForeignKey("dbo.AspNetUsers", t => t.ModifiedById)
                .ForeignKey("dbo.ServiceType", t => t.ServiceTypeId, cascadeDelete: true)
                .ForeignKey("dbo.SidProduct", t => t.SidProductId, cascadeDelete: true)
                .Index(t => t.SidProductId)
                .Index(t => t.ServiceTypeId)
                .Index(t => t.CreatedById)
                .Index(t => t.ModifiedById);
            
            CreateTable(
                "dbo.PrintDelivery",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        JobTrackerId = c.Int(nullable: false),
                        DepartmentId = c.Int(nullable: false),
                        RangeFrom = c.Int(nullable: false),
                        RangeTo = c.Int(nullable: false),
                        IsDeliveryConfirmed = c.Boolean(nullable: false),
                        IsDeliveryCompleted = c.Boolean(nullable: false),
                        DeliveredById = c.String(maxLength: 128),
                        DeliveredOn = c.DateTime(nullable: false),
                        ConfirmedById = c.String(maxLength: 128),
                        ConfirmedOn = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.ConfirmedById)
                .ForeignKey("dbo.AspNetUsers", t => t.DeliveredById)
                .ForeignKey("dbo.Department", t => t.DepartmentId, cascadeDelete: true)
                .ForeignKey("dbo.JobTracker", t => t.JobTrackerId, cascadeDelete: true)
                .Index(t => t.JobTrackerId)
                .Index(t => t.DepartmentId)
                .Index(t => t.DeliveredById)
                .Index(t => t.ConfirmedById);
            
            CreateTable(
                "dbo.PrintHeldAnalysis",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        JobTrackerId = c.Int(nullable: false),
                        JobSplitId = c.Int(nullable: false),
                        JobSplitPrintCEAnalysisId = c.Int(nullable: false),
                        QuantityHeld = c.Int(nullable: false),
                        WasteErrorSourceId = c.Int(nullable: false),
                        WasteByUnitId = c.Int(nullable: false),
                        IsCardCollected = c.Boolean(nullable: false),
                        CreatedById = c.String(maxLength: 128),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedById = c.String(maxLength: 128),
                        ModifiedOn = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.CreatedById)
                .ForeignKey("dbo.JobSplit", t => t.JobSplitId, cascadeDelete: true)
                .ForeignKey("dbo.JobSplitPrintCEAnalysis", t => t.JobSplitPrintCEAnalysisId, cascadeDelete: false)
                .ForeignKey("dbo.JobTracker", t => t.JobTrackerId, cascadeDelete: true)
                .ForeignKey("dbo.AspNetUsers", t => t.ModifiedById)
                .ForeignKey("dbo.Department", t => t.WasteByUnitId, cascadeDelete: true)
                .Index(t => t.JobTrackerId)
                .Index(t => t.JobSplitId)
                .Index(t => t.JobSplitPrintCEAnalysisId)
                .Index(t => t.WasteByUnitId)
                .Index(t => t.CreatedById)
                .Index(t => t.ModifiedById);
            
            CreateTable(
                "dbo.PrintWasteAnalysis",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        JobTrackerId = c.Int(nullable: false),
                        JobSplitId = c.Int(nullable: false),
                        JobSplitPrintCEAnalysisId = c.Int(nullable: false),
                        QuantityBad = c.Int(nullable: false),
                        WasteErrorSourceId = c.Int(nullable: false),
                        WasteByUnitId = c.Int(nullable: false),
                        IsCardCollected = c.Boolean(nullable: false),
                        CreatedById = c.String(maxLength: 128),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedById = c.String(maxLength: 128),
                        ModifiedOn = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.CreatedById)
                .ForeignKey("dbo.JobSplit", t => t.JobSplitId, cascadeDelete: true)
                .ForeignKey("dbo.JobSplitPrintCEAnalysis", t => t.JobSplitPrintCEAnalysisId, cascadeDelete: false)
                .ForeignKey("dbo.JobTracker", t => t.JobTrackerId, cascadeDelete: true)
                .ForeignKey("dbo.AspNetUsers", t => t.ModifiedById)
                .ForeignKey("dbo.Department", t => t.WasteByUnitId, cascadeDelete: true)
                .ForeignKey("dbo.WasteErrorSource", t => t.WasteErrorSourceId, cascadeDelete: true)
                .Index(t => t.JobTrackerId)
                .Index(t => t.JobSplitId)
                .Index(t => t.JobSplitPrintCEAnalysisId)
                .Index(t => t.WasteErrorSourceId)
                .Index(t => t.WasteByUnitId)
                .Index(t => t.CreatedById)
                .Index(t => t.ModifiedById);
            
            CreateTable(
                "dbo.Priority",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.ProductService",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        SidProductId = c.Int(nullable: false),
                        ServiceTypeId = c.Int(nullable: false),
                        Priority = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.ServiceType", t => t.ServiceTypeId, cascadeDelete: true)
                .ForeignKey("dbo.SidProduct", t => t.SidProductId, cascadeDelete: true)
                .Index(t => t.SidProductId)
                .Index(t => t.ServiceTypeId);
            
            CreateTable(
                "dbo.RefreshToken",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        Subject = c.String(nullable: false, maxLength: 50),
                        ClientId = c.String(nullable: false, maxLength: 50),
                        IssuedUtc = c.DateTime(nullable: false),
                        ExpiresUtc = c.DateTime(nullable: false),
                        ProtectedTicket = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.AspNetRoles",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        Name = c.String(nullable: false, maxLength: 256),
                    })
                .PrimaryKey(t => t.Id)
                .Index(t => t.Name, unique: true, name: "RoleNameIndex");
            
            CreateTable(
                "dbo.ServerJobQueue",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        JobName = c.String(),
                        IsTreated = c.Boolean(nullable: false),
                        IsDeleted = c.Boolean(nullable: false),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Sid01CardOps",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        JobId = c.Int(nullable: false),
                        CreatedUserId = c.String(maxLength: 128),
                        CreatedOn = c.DateTime(nullable: false),
                        TimeIn = c.DateTime(nullable: false),
                        TimeOut = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.CreatedUserId)
                .Index(t => t.CreatedUserId);
            
            CreateTable(
                "dbo.Sid03FirstCard",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        JobTrackerId = c.Int(nullable: false),
                        InitializedById = c.String(maxLength: 128),
                        InitializedOn = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.InitializedById)
                .ForeignKey("dbo.JobTracker", t => t.JobTrackerId, cascadeDelete: true)
                .Index(t => t.JobTrackerId)
                .Index(t => t.InitializedById);
            
            CreateTable(
                "dbo.Sid04Printing",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        JobTrackerId = c.Int(nullable: false),
                        InitializedById = c.String(maxLength: 128),
                        CompletedOn = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.InitializedById)
                .ForeignKey("dbo.JobTracker", t => t.JobTrackerId, cascadeDelete: true)
                .Index(t => t.JobTrackerId)
                .Index(t => t.InitializedById);
            
            CreateTable(
                "dbo.Sid05QA",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        JobTrackerId = c.Int(nullable: false),
                        JobSplitId = c.Int(nullable: false),
                        Magstripe = c.Boolean(nullable: false),
                        Indenting = c.Boolean(nullable: false),
                        Embossing = c.Boolean(nullable: false),
                        Picture = c.Boolean(nullable: false),
                        Fulfillment = c.Boolean(nullable: false),
                        Client = c.Boolean(nullable: false),
                        CardType = c.Boolean(nullable: false),
                        PictureView = c.Boolean(nullable: false),
                        Variant = c.Boolean(nullable: false),
                        CardIdNumber = c.Boolean(nullable: false),
                        Bin = c.Boolean(nullable: false),
                        MagstripeTrack = c.Boolean(nullable: false),
                        Cvv = c.Boolean(nullable: false),
                        PanSpacing = c.Boolean(nullable: false),
                        CreatedById = c.String(maxLength: 128),
                        CreatedOn = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.CreatedById)
                .ForeignKey("dbo.JobSplit", t => t.JobSplitId, cascadeDelete: true)
                .ForeignKey("dbo.JobTracker", t => t.JobTrackerId, cascadeDelete: true)
                .Index(t => t.JobTrackerId)
                .Index(t => t.JobSplitId)
                .Index(t => t.CreatedById);
            
            CreateTable(
                "dbo.Sid06QC",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        JobTrackerId = c.Int(nullable: false),
                        StartFrom = c.Int(nullable: false),
                        EndPoint = c.Int(nullable: false),
                        RunById = c.String(maxLength: 128),
                        RunDate = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.JobTracker", t => t.JobTrackerId, cascadeDelete: true)
                .ForeignKey("dbo.AspNetUsers", t => t.RunById)
                .Index(t => t.JobTrackerId)
                .Index(t => t.RunById);
            
            CreateTable(
                "dbo.Sid07Mailing",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        JobId = c.Int(nullable: false),
                        MailingModeId = c.Int(nullable: false),
                        StartFrom = c.Int(nullable: false),
                        EndPoint = c.Int(nullable: false),
                        RunById = c.String(maxLength: 128),
                        RunDate = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Job", t => t.JobId, cascadeDelete: true)
                .ForeignKey("dbo.MailingMode", t => t.MailingModeId, cascadeDelete: true)
                .ForeignKey("dbo.AspNetUsers", t => t.RunById)
                .Index(t => t.JobId)
                .Index(t => t.MailingModeId)
                .Index(t => t.RunById);
            
            CreateTable(
                "dbo.MailingMode",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Sid08Dispatch",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        JobId = c.Int(nullable: false),
                        ReceivedById = c.String(maxLength: 128),
                        ReceivedOn = c.DateTime(nullable: false),
                        IsNoteGenerated = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Job", t => t.JobId, cascadeDelete: true)
                .ForeignKey("dbo.AspNetUsers", t => t.ReceivedById)
                .Index(t => t.JobId)
                .Index(t => t.ReceivedById);
            
            CreateTable(
                "dbo.Sid09CustomerService",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        DeliveryNoteLogId = c.Int(nullable: false),
                        CreatedById = c.String(maxLength: 128),
                        CreatedOn = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.CreatedById)
                .ForeignKey("dbo.DeliveryNoteLog", t => t.DeliveryNoteLogId, cascadeDelete: true)
                .Index(t => t.DeliveryNoteLogId)
                .Index(t => t.CreatedById);
            
            CreateTable(
                "dbo.SidChipType",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        SidCardTypeId = c.Int(nullable: false),
                        Name = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.SidCardType", t => t.SidCardTypeId, cascadeDelete: true)
                .Index(t => t.SidCardTypeId);
            
            CreateTable(
                "dbo.SidVariant",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        ShortCode = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.StationaryInwardGood",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        GoodsName = c.String(),
                        Quantity = c.Int(nullable: false),
                        TimeOfReceipt = c.DateTime(nullable: false),
                        GoodsFrom = c.String(),
                        Attention = c.String(),
                        BroughtBy = c.String(),
                        ReceivedBy = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.StockStatus",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        SidClientId = c.Int(nullable: false),
                        SidVariantId = c.Int(nullable: false),
                        CardIssuanceId = c.Int(nullable: false),
                        TotalDataReceived = c.Int(nullable: false),
                        OpeningStock = c.Int(nullable: false),
                        NewStock = c.Int(nullable: false),
                        TotalIssued = c.Int(nullable: false),
                        TotalDelivered = c.Int(nullable: false),
                        TotalProductionSpoil = c.Int(nullable: false),
                        TotalWasteSent = c.Int(nullable: false),
                        CardIssuedById = c.String(maxLength: 128),
                        CardCollectedById = c.String(maxLength: 128),
                        CreatedOn = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.CardCollectedById)
                .ForeignKey("dbo.AspNetUsers", t => t.CardIssuedById)
                .ForeignKey("dbo.SidClient", t => t.SidClientId, cascadeDelete: true)
                .ForeignKey("dbo.SidVariant", t => t.SidVariantId, cascadeDelete: true)
                .Index(t => t.SidClientId)
                .Index(t => t.SidVariantId)
                .Index(t => t.CardIssuedById)
                .Index(t => t.CardCollectedById);
            
            CreateTable(
                "dbo.WasteErrorSourceCode",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        WasteErrorSourceId = c.Int(nullable: false),
                        Name = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.WasteErrorSource", t => t.WasteErrorSourceId, cascadeDelete: true)
                .Index(t => t.WasteErrorSourceId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.WasteErrorSourceCode", "WasteErrorSourceId", "dbo.WasteErrorSource");
            DropForeignKey("dbo.StockStatus", "SidVariantId", "dbo.SidVariant");
            DropForeignKey("dbo.StockStatus", "SidClientId", "dbo.SidClient");
            DropForeignKey("dbo.StockStatus", "CardIssuedById", "dbo.AspNetUsers");
            DropForeignKey("dbo.StockStatus", "CardCollectedById", "dbo.AspNetUsers");
            DropForeignKey("dbo.SidChipType", "SidCardTypeId", "dbo.SidCardType");
            DropForeignKey("dbo.Sid09CustomerService", "DeliveryNoteLogId", "dbo.DeliveryNoteLog");
            DropForeignKey("dbo.Sid09CustomerService", "CreatedById", "dbo.AspNetUsers");
            DropForeignKey("dbo.Sid08Dispatch", "ReceivedById", "dbo.AspNetUsers");
            DropForeignKey("dbo.Sid08Dispatch", "JobId", "dbo.Job");
            DropForeignKey("dbo.Sid07Mailing", "RunById", "dbo.AspNetUsers");
            DropForeignKey("dbo.Sid07Mailing", "MailingModeId", "dbo.MailingMode");
            DropForeignKey("dbo.Sid07Mailing", "JobId", "dbo.Job");
            DropForeignKey("dbo.Sid06QC", "RunById", "dbo.AspNetUsers");
            DropForeignKey("dbo.Sid06QC", "JobTrackerId", "dbo.JobTracker");
            DropForeignKey("dbo.Sid05QA", "JobTrackerId", "dbo.JobTracker");
            DropForeignKey("dbo.Sid05QA", "JobSplitId", "dbo.JobSplit");
            DropForeignKey("dbo.Sid05QA", "CreatedById", "dbo.AspNetUsers");
            DropForeignKey("dbo.Sid04Printing", "JobTrackerId", "dbo.JobTracker");
            DropForeignKey("dbo.Sid04Printing", "InitializedById", "dbo.AspNetUsers");
            DropForeignKey("dbo.Sid03FirstCard", "JobTrackerId", "dbo.JobTracker");
            DropForeignKey("dbo.Sid03FirstCard", "InitializedById", "dbo.AspNetUsers");
            DropForeignKey("dbo.Sid01CardOps", "CreatedUserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserRoles", "RoleId", "dbo.AspNetRoles");
            DropForeignKey("dbo.ProductService", "SidProductId", "dbo.SidProduct");
            DropForeignKey("dbo.ProductService", "ServiceTypeId", "dbo.ServiceType");
            DropForeignKey("dbo.PrintWasteAnalysis", "WasteErrorSourceId", "dbo.WasteErrorSource");
            DropForeignKey("dbo.PrintWasteAnalysis", "WasteByUnitId", "dbo.Department");
            DropForeignKey("dbo.PrintWasteAnalysis", "ModifiedById", "dbo.AspNetUsers");
            DropForeignKey("dbo.PrintWasteAnalysis", "JobTrackerId", "dbo.JobTracker");
            DropForeignKey("dbo.PrintWasteAnalysis", "JobSplitPrintCEAnalysisId", "dbo.JobSplitPrintCEAnalysis");
            DropForeignKey("dbo.PrintWasteAnalysis", "JobSplitId", "dbo.JobSplit");
            DropForeignKey("dbo.PrintWasteAnalysis", "CreatedById", "dbo.AspNetUsers");
            DropForeignKey("dbo.PrintHeldAnalysis", "WasteByUnitId", "dbo.Department");
            DropForeignKey("dbo.PrintHeldAnalysis", "ModifiedById", "dbo.AspNetUsers");
            DropForeignKey("dbo.PrintHeldAnalysis", "JobTrackerId", "dbo.JobTracker");
            DropForeignKey("dbo.PrintHeldAnalysis", "JobSplitPrintCEAnalysisId", "dbo.JobSplitPrintCEAnalysis");
            DropForeignKey("dbo.PrintHeldAnalysis", "JobSplitId", "dbo.JobSplit");
            DropForeignKey("dbo.PrintHeldAnalysis", "CreatedById", "dbo.AspNetUsers");
            DropForeignKey("dbo.PrintDelivery", "JobTrackerId", "dbo.JobTracker");
            DropForeignKey("dbo.PrintDelivery", "DepartmentId", "dbo.Department");
            DropForeignKey("dbo.PrintDelivery", "DeliveredById", "dbo.AspNetUsers");
            DropForeignKey("dbo.PrintDelivery", "ConfirmedById", "dbo.AspNetUsers");
            DropForeignKey("dbo.NonPersoJob", "SidProductId", "dbo.SidProduct");
            DropForeignKey("dbo.NonPersoJob", "ServiceTypeId", "dbo.ServiceType");
            DropForeignKey("dbo.NonPersoJob", "ModifiedById", "dbo.AspNetUsers");
            DropForeignKey("dbo.NonPersoJob", "CreatedById", "dbo.AspNetUsers");
            DropForeignKey("dbo.JobWaste", "WasteTypeId", "dbo.WasteType");
            DropForeignKey("dbo.JobWaste", "JobId", "dbo.Job");
            DropForeignKey("dbo.JobWaste", "DepartmentId", "dbo.Department");
            DropForeignKey("dbo.JobWaste", "CreatedById", "dbo.AspNetUsers");
            DropForeignKey("dbo.JobWasteLog", "WasteTypeId", "dbo.WasteType");
            DropForeignKey("dbo.JobWasteLog", "JobId", "dbo.Job");
            DropForeignKey("dbo.JobWasteLog", "CreatedById", "dbo.AspNetUsers");
            DropForeignKey("dbo.JobVariant", "SidProductId", "dbo.SidProduct");
            DropForeignKey("dbo.JobVariant", "ServiceTypeId", "dbo.ServiceType");
            DropForeignKey("dbo.JobVariant", "JobTrackerId", "dbo.JobTracker");
            DropForeignKey("dbo.JobVariant", "JobId", "dbo.Job");
            DropForeignKey("dbo.JobSplitPrintCEAnalysis", "ModifiedById", "dbo.AspNetUsers");
            DropForeignKey("dbo.JobSplitPrintCEAnalysis", "JobTrackerId", "dbo.JobTracker");
            DropForeignKey("dbo.JobSplitPrintCEAnalysis", "JobSplitId", "dbo.JobSplit");
            DropForeignKey("dbo.JobSplitPrintCEAnalysis", "CreatedById", "dbo.AspNetUsers");
            DropForeignKey("dbo.JobHandler", "JobTrackerId", "dbo.JobTracker");
            DropForeignKey("dbo.JobHandler", "JobSplitId", "dbo.JobSplit");
            DropForeignKey("dbo.JobHandler", "HandlerId", "dbo.AspNetUsers");
            DropForeignKey("dbo.JobFlag", "TargetUnitId", "dbo.Department");
            DropForeignKey("dbo.JobFlag", "ResolvedById", "dbo.AspNetUsers");
            DropForeignKey("dbo.JobFlag", "ModifiedById", "dbo.AspNetUsers");
            DropForeignKey("dbo.JobFlag", "JobTrackerId", "dbo.JobTracker");
            DropForeignKey("dbo.JobFlag", "FlagTypeId", "dbo.FlagType");
            DropForeignKey("dbo.JobFlag", "CreatedById", "dbo.AspNetUsers");
            DropForeignKey("dbo.EmbedCardReceipt", "VendorId", "dbo.Vendor");
            DropForeignKey("dbo.EmbedCardReceipt", "SIDReceiverId", "dbo.AspNetUsers");
            DropForeignKey("dbo.EmbedCardReceipt", "SidProductId", "dbo.SidProduct");
            DropForeignKey("dbo.EmbedCardReceipt", "EmbedCardRequestId", "dbo.EmbedCardRequest");
            DropForeignKey("dbo.EmbedCardRequest", "SidProductId", "dbo.SidProduct");
            DropForeignKey("dbo.EmbedCardRequest", "CreatedById", "dbo.AspNetUsers");
            DropForeignKey("dbo.DictionaryServiceType", "SidClientId", "dbo.SidClient");
            DropForeignKey("dbo.DictionaryServiceType", "SidCardTypeId", "dbo.SidCardType");
            DropForeignKey("dbo.DictionaryServiceType", "ServiceTypeId", "dbo.ServiceType");
            DropForeignKey("dbo.DictionaryClientName", "SidClientId", "dbo.SidClient");
            DropForeignKey("dbo.DictionaryCardType", "SidCardTypeId", "dbo.SidCardType");
            DropForeignKey("dbo.DeliveryNoteMaterialAudit", "CreatedById", "dbo.AspNetUsers");
            DropForeignKey("dbo.DeliveryNoteMaterialAudit", "AssignedDriverId", "dbo.AspNetUsers");
            DropForeignKey("dbo.DeliveryNoteLog", "JobTrackerId", "dbo.JobTracker");
            DropForeignKey("dbo.DeliveryNoteLog", "DispatchDeliveryId", "dbo.DispatchDelivery");
            DropForeignKey("dbo.DispatchDelivery", "SidClientId", "dbo.SidClient");
            DropForeignKey("dbo.DispatchDelivery", "JobTrackerId", "dbo.JobTracker");
            DropForeignKey("dbo.DispatchDelivery", "CreatedById", "dbo.AspNetUsers");
            DropForeignKey("dbo.DeliveryNoteLog", "DeliveryNoteId", "dbo.DeliveryNote");
            DropForeignKey("dbo.DeliveryNote", "SidClientId", "dbo.SidClient");
            DropForeignKey("dbo.DeliveryNote", "DeliveryProfileId", "dbo.DeliveryProfile");
            DropForeignKey("dbo.DeliveryNote", "CreatedById", "dbo.AspNetUsers");
            DropForeignKey("dbo.DeliveryNoteClientTemplate", "DeliveryNoteId", "dbo.DeliveryProfile");
            DropForeignKey("dbo.DeliveryNoteClientTemplate", "DeliveryNoteTemplateId", "dbo.DeliveryNoteTemplate");
            DropForeignKey("dbo.ClientUser", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.ClientUser", "SidClientId", "dbo.SidClient");
            DropForeignKey("dbo.ClientStockLog", "ClientStockReportId", "dbo.ClientStockReport");
            DropForeignKey("dbo.ClientStockLog", "CardIssuanceId", "dbo.CardIssuance");
            DropForeignKey("dbo.ClientReturnLog", "ClientStockReportId", "dbo.ClientStockReport");
            DropForeignKey("dbo.ClientStockReport", "SidProductId", "dbo.SidProduct");
            DropForeignKey("dbo.ClientStockReport", "ClientVaultReportId", "dbo.ClientVaultReport");
            DropForeignKey("dbo.ClientVaultReport", "SidProductId", "dbo.SidProduct");
            DropForeignKey("dbo.SidProduct", "SidClientId", "dbo.SidClient");
            DropForeignKey("dbo.SidProduct", "SidCardTypeId", "dbo.SidCardType");
            DropForeignKey("dbo.CardWasteAnalysis", "WasteErrorSourceId", "dbo.WasteErrorSource");
            DropForeignKey("dbo.CardWasteAnalysis", "WasteByUnitId", "dbo.Department");
            DropForeignKey("dbo.CardWasteAnalysis", "ModifiedById", "dbo.AspNetUsers");
            DropForeignKey("dbo.CardWasteAnalysis", "JobTrackerId", "dbo.JobTracker");
            DropForeignKey("dbo.CardWasteAnalysis", "JobSplitCEAnalysisId", "dbo.JobSplitCEAnalysis");
            DropForeignKey("dbo.JobSplitCEAnalysis", "ModifiedById", "dbo.AspNetUsers");
            DropForeignKey("dbo.JobSplitCEAnalysis", "JobTrackerId", "dbo.JobTracker");
            DropForeignKey("dbo.JobSplitCEAnalysis", "JobSplitId", "dbo.JobSplit");
            DropForeignKey("dbo.JobSplitCEAnalysis", "CreatedById", "dbo.AspNetUsers");
            DropForeignKey("dbo.CardWasteAnalysis", "JobSplitId", "dbo.JobSplit");
            DropForeignKey("dbo.CardWasteAnalysis", "CreatedById", "dbo.AspNetUsers");
            DropForeignKey("dbo.CardIssuanceLog", "JobTrackerId", "dbo.JobTracker");
            DropForeignKey("dbo.CardIssuanceLog", "IssuanceTypeId", "dbo.IssuanceType");
            DropForeignKey("dbo.CardIssuanceLog", "IssuanceId", "dbo.AspNetUsers");
            DropForeignKey("dbo.CardIssuanceLog", "CollectorId", "dbo.AspNetUsers");
            DropForeignKey("dbo.CardIssuanceLog", "CardIssuanceId", "dbo.CardIssuance");
            DropForeignKey("dbo.CardIssuance", "JobId", "dbo.Job");
            DropForeignKey("dbo.CardIssuance", "IssuanceId", "dbo.AspNetUsers");
            DropForeignKey("dbo.CardIssuance", "CollectorId", "dbo.AspNetUsers");
            DropForeignKey("dbo.CardHeldAnalysis", "WasteByUnitId", "dbo.Department");
            DropForeignKey("dbo.CardHeldAnalysis", "ModifiedById", "dbo.AspNetUsers");
            DropForeignKey("dbo.CardHeldAnalysis", "JobTrackerId", "dbo.JobTracker");
            DropForeignKey("dbo.CardHeldAnalysis", "JobSplitId", "dbo.JobSplit");
            DropForeignKey("dbo.JobSplit", "SidMachineId", "dbo.SidMachine");
            DropForeignKey("dbo.SidMachine", "DepartmentId", "dbo.Department");
            DropForeignKey("dbo.JobSplit", "JobTrackerId", "dbo.JobTracker");
            DropForeignKey("dbo.JobSplit", "DepartmentId", "dbo.Department");
            DropForeignKey("dbo.JobSplit", "CreatedById", "dbo.AspNetUsers");
            DropForeignKey("dbo.CardHeldAnalysis", "CreatedById", "dbo.AspNetUsers");
            DropForeignKey("dbo.CardDeliveryLog", "JobTrackerId", "dbo.JobTracker");
            DropForeignKey("dbo.CardDeliveryLog", "CreatedById", "dbo.AspNetUsers");
            DropForeignKey("dbo.CardDeliveryLog", "ConfirmedById", "dbo.AspNetUsers");
            DropForeignKey("dbo.CardDeliveryLog", "CardDeliveryId", "dbo.CardDelivery");
            DropForeignKey("dbo.CardDelivery", "TargetDepartmentId", "dbo.Department");
            DropForeignKey("dbo.CardDelivery", "JobTrackerId", "dbo.JobTracker");
            DropForeignKey("dbo.JobTracker", "CustomerServiceId", "dbo.JobStatus");
            DropForeignKey("dbo.JobTracker", "MAudId", "dbo.JobStatus");
            DropForeignKey("dbo.JobTracker", "DispatchId", "dbo.JobStatus");
            DropForeignKey("dbo.JobTracker", "MailingId", "dbo.JobStatus");
            DropForeignKey("dbo.JobTracker", "QCId", "dbo.JobStatus");
            DropForeignKey("dbo.JobTracker", "CardEngrResumeId", "dbo.JobStatus");
            DropForeignKey("dbo.JobTracker", "FirstJobRunId", "dbo.JobStatus");
            DropForeignKey("dbo.JobTracker", "QAId", "dbo.JobStatus");
            DropForeignKey("dbo.JobTracker", "CardEngrId", "dbo.JobStatus");
            DropForeignKey("dbo.JobTracker", "PrintQCId", "dbo.JobStatus");
            DropForeignKey("dbo.JobTracker", "PrintQAId", "dbo.JobStatus");
            DropForeignKey("dbo.JobTracker", "PrintingId", "dbo.JobStatus");
            DropForeignKey("dbo.JobTracker", "InventoryId", "dbo.JobStatus");
            DropForeignKey("dbo.JobTracker", "CardOpsId", "dbo.JobStatus");
            DropForeignKey("dbo.JobTracker", "JobStatusId", "dbo.JobStatus");
            DropForeignKey("dbo.JobTracker", "JobId", "dbo.Job");
            DropForeignKey("dbo.Job", "SidClientId", "dbo.SidClient");
            DropForeignKey("dbo.Job", "SidCardTypeId", "dbo.SidCardType");
            DropForeignKey("dbo.Job", "ServiceTypeId", "dbo.ServiceType");
            DropForeignKey("dbo.Job", "RemarkId", "dbo.Remark");
            DropForeignKey("dbo.Remark", "SidClientId", "dbo.SidClient");
            DropForeignKey("dbo.SidClient", "SectorId", "dbo.SidSector");
            DropForeignKey("dbo.Job", "JobStatusId", "dbo.JobStatus");
            DropForeignKey("dbo.CardDelivery", "DepartmentId", "dbo.Department");
            DropForeignKey("dbo.CardDelivery", "DeliveredById", "dbo.AspNetUsers");
            DropForeignKey("dbo.CardDelivery", "ConfirmedById", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserRoles", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserLogins", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserClaims", "UserId", "dbo.AspNetUsers");
            DropIndex("dbo.WasteErrorSourceCode", new[] { "WasteErrorSourceId" });
            DropIndex("dbo.StockStatus", new[] { "CardCollectedById" });
            DropIndex("dbo.StockStatus", new[] { "CardIssuedById" });
            DropIndex("dbo.StockStatus", new[] { "SidVariantId" });
            DropIndex("dbo.StockStatus", new[] { "SidClientId" });
            DropIndex("dbo.SidChipType", new[] { "SidCardTypeId" });
            DropIndex("dbo.Sid09CustomerService", new[] { "CreatedById" });
            DropIndex("dbo.Sid09CustomerService", new[] { "DeliveryNoteLogId" });
            DropIndex("dbo.Sid08Dispatch", new[] { "ReceivedById" });
            DropIndex("dbo.Sid08Dispatch", new[] { "JobId" });
            DropIndex("dbo.Sid07Mailing", new[] { "RunById" });
            DropIndex("dbo.Sid07Mailing", new[] { "MailingModeId" });
            DropIndex("dbo.Sid07Mailing", new[] { "JobId" });
            DropIndex("dbo.Sid06QC", new[] { "RunById" });
            DropIndex("dbo.Sid06QC", new[] { "JobTrackerId" });
            DropIndex("dbo.Sid05QA", new[] { "CreatedById" });
            DropIndex("dbo.Sid05QA", new[] { "JobSplitId" });
            DropIndex("dbo.Sid05QA", new[] { "JobTrackerId" });
            DropIndex("dbo.Sid04Printing", new[] { "InitializedById" });
            DropIndex("dbo.Sid04Printing", new[] { "JobTrackerId" });
            DropIndex("dbo.Sid03FirstCard", new[] { "InitializedById" });
            DropIndex("dbo.Sid03FirstCard", new[] { "JobTrackerId" });
            DropIndex("dbo.Sid01CardOps", new[] { "CreatedUserId" });
            DropIndex("dbo.AspNetRoles", "RoleNameIndex");
            DropIndex("dbo.ProductService", new[] { "ServiceTypeId" });
            DropIndex("dbo.ProductService", new[] { "SidProductId" });
            DropIndex("dbo.PrintWasteAnalysis", new[] { "ModifiedById" });
            DropIndex("dbo.PrintWasteAnalysis", new[] { "CreatedById" });
            DropIndex("dbo.PrintWasteAnalysis", new[] { "WasteByUnitId" });
            DropIndex("dbo.PrintWasteAnalysis", new[] { "WasteErrorSourceId" });
            DropIndex("dbo.PrintWasteAnalysis", new[] { "JobSplitPrintCEAnalysisId" });
            DropIndex("dbo.PrintWasteAnalysis", new[] { "JobSplitId" });
            DropIndex("dbo.PrintWasteAnalysis", new[] { "JobTrackerId" });
            DropIndex("dbo.PrintHeldAnalysis", new[] { "ModifiedById" });
            DropIndex("dbo.PrintHeldAnalysis", new[] { "CreatedById" });
            DropIndex("dbo.PrintHeldAnalysis", new[] { "WasteByUnitId" });
            DropIndex("dbo.PrintHeldAnalysis", new[] { "JobSplitPrintCEAnalysisId" });
            DropIndex("dbo.PrintHeldAnalysis", new[] { "JobSplitId" });
            DropIndex("dbo.PrintHeldAnalysis", new[] { "JobTrackerId" });
            DropIndex("dbo.PrintDelivery", new[] { "ConfirmedById" });
            DropIndex("dbo.PrintDelivery", new[] { "DeliveredById" });
            DropIndex("dbo.PrintDelivery", new[] { "DepartmentId" });
            DropIndex("dbo.PrintDelivery", new[] { "JobTrackerId" });
            DropIndex("dbo.NonPersoJob", new[] { "ModifiedById" });
            DropIndex("dbo.NonPersoJob", new[] { "CreatedById" });
            DropIndex("dbo.NonPersoJob", new[] { "ServiceTypeId" });
            DropIndex("dbo.NonPersoJob", new[] { "SidProductId" });
            DropIndex("dbo.JobWaste", new[] { "CreatedById" });
            DropIndex("dbo.JobWaste", new[] { "DepartmentId" });
            DropIndex("dbo.JobWaste", new[] { "WasteTypeId" });
            DropIndex("dbo.JobWaste", new[] { "JobId" });
            DropIndex("dbo.JobWasteLog", new[] { "CreatedById" });
            DropIndex("dbo.JobWasteLog", new[] { "WasteTypeId" });
            DropIndex("dbo.JobWasteLog", new[] { "JobId" });
            DropIndex("dbo.JobVariant", new[] { "ServiceTypeId" });
            DropIndex("dbo.JobVariant", new[] { "SidProductId" });
            DropIndex("dbo.JobVariant", new[] { "JobTrackerId" });
            DropIndex("dbo.JobVariant", new[] { "JobId" });
            DropIndex("dbo.JobSplitPrintCEAnalysis", new[] { "ModifiedById" });
            DropIndex("dbo.JobSplitPrintCEAnalysis", new[] { "CreatedById" });
            DropIndex("dbo.JobSplitPrintCEAnalysis", new[] { "JobSplitId" });
            DropIndex("dbo.JobSplitPrintCEAnalysis", new[] { "JobTrackerId" });
            DropIndex("dbo.JobHandler", new[] { "HandlerId" });
            DropIndex("dbo.JobHandler", new[] { "JobSplitId" });
            DropIndex("dbo.JobHandler", new[] { "JobTrackerId" });
            DropIndex("dbo.JobFlag", new[] { "ModifiedById" });
            DropIndex("dbo.JobFlag", new[] { "CreatedById" });
            DropIndex("dbo.JobFlag", new[] { "ResolvedById" });
            DropIndex("dbo.JobFlag", new[] { "TargetUnitId" });
            DropIndex("dbo.JobFlag", new[] { "FlagTypeId" });
            DropIndex("dbo.JobFlag", new[] { "JobTrackerId" });
            DropIndex("dbo.EmbedCardRequest", new[] { "CreatedById" });
            DropIndex("dbo.EmbedCardRequest", new[] { "SidProductId" });
            DropIndex("dbo.EmbedCardReceipt", new[] { "SIDReceiverId" });
            DropIndex("dbo.EmbedCardReceipt", new[] { "VendorId" });
            DropIndex("dbo.EmbedCardReceipt", new[] { "EmbedCardRequestId" });
            DropIndex("dbo.EmbedCardReceipt", new[] { "SidProductId" });
            DropIndex("dbo.DictionaryServiceType", new[] { "ServiceTypeId" });
            DropIndex("dbo.DictionaryServiceType", new[] { "SidCardTypeId" });
            DropIndex("dbo.DictionaryServiceType", new[] { "SidClientId" });
            DropIndex("dbo.DictionaryClientName", new[] { "SidClientId" });
            DropIndex("dbo.DictionaryCardType", new[] { "SidCardTypeId" });
            DropIndex("dbo.DeliveryNoteMaterialAudit", new[] { "CreatedById" });
            DropIndex("dbo.DeliveryNoteMaterialAudit", new[] { "AssignedDriverId" });
            DropIndex("dbo.DispatchDelivery", new[] { "CreatedById" });
            DropIndex("dbo.DispatchDelivery", new[] { "JobTrackerId" });
            DropIndex("dbo.DispatchDelivery", new[] { "SidClientId" });
            DropIndex("dbo.DeliveryNote", new[] { "CreatedById" });
            DropIndex("dbo.DeliveryNote", new[] { "DeliveryProfileId" });
            DropIndex("dbo.DeliveryNote", new[] { "SidClientId" });
            DropIndex("dbo.DeliveryNoteLog", new[] { "JobTrackerId" });
            DropIndex("dbo.DeliveryNoteLog", new[] { "DeliveryNoteId" });
            DropIndex("dbo.DeliveryNoteLog", new[] { "DispatchDeliveryId" });
            DropIndex("dbo.DeliveryNoteClientTemplate", new[] { "DeliveryNoteTemplateId" });
            DropIndex("dbo.DeliveryNoteClientTemplate", new[] { "DeliveryNoteId" });
            DropIndex("dbo.ClientUser", new[] { "UserId" });
            DropIndex("dbo.ClientUser", new[] { "SidClientId" });
            DropIndex("dbo.ClientStockLog", new[] { "CardIssuanceId" });
            DropIndex("dbo.ClientStockLog", new[] { "ClientStockReportId" });
            DropIndex("dbo.SidProduct", new[] { "SidCardTypeId" });
            DropIndex("dbo.SidProduct", new[] { "SidClientId" });
            DropIndex("dbo.ClientVaultReport", new[] { "SidProductId" });
            DropIndex("dbo.ClientStockReport", new[] { "ClientVaultReportId" });
            DropIndex("dbo.ClientStockReport", new[] { "SidProductId" });
            DropIndex("dbo.ClientReturnLog", new[] { "ClientStockReportId" });
            DropIndex("dbo.JobSplitCEAnalysis", new[] { "ModifiedById" });
            DropIndex("dbo.JobSplitCEAnalysis", new[] { "CreatedById" });
            DropIndex("dbo.JobSplitCEAnalysis", new[] { "JobSplitId" });
            DropIndex("dbo.JobSplitCEAnalysis", new[] { "JobTrackerId" });
            DropIndex("dbo.CardWasteAnalysis", new[] { "ModifiedById" });
            DropIndex("dbo.CardWasteAnalysis", new[] { "CreatedById" });
            DropIndex("dbo.CardWasteAnalysis", new[] { "WasteByUnitId" });
            DropIndex("dbo.CardWasteAnalysis", new[] { "WasteErrorSourceId" });
            DropIndex("dbo.CardWasteAnalysis", new[] { "JobSplitCEAnalysisId" });
            DropIndex("dbo.CardWasteAnalysis", new[] { "JobSplitId" });
            DropIndex("dbo.CardWasteAnalysis", new[] { "JobTrackerId" });
            DropIndex("dbo.CardIssuance", new[] { "CollectorId" });
            DropIndex("dbo.CardIssuance", new[] { "IssuanceId" });
            DropIndex("dbo.CardIssuance", new[] { "JobId" });
            DropIndex("dbo.CardIssuanceLog", new[] { "CollectorId" });
            DropIndex("dbo.CardIssuanceLog", new[] { "IssuanceId" });
            DropIndex("dbo.CardIssuanceLog", new[] { "IssuanceTypeId" });
            DropIndex("dbo.CardIssuanceLog", new[] { "JobTrackerId" });
            DropIndex("dbo.CardIssuanceLog", new[] { "CardIssuanceId" });
            DropIndex("dbo.SidMachine", new[] { "DepartmentId" });
            DropIndex("dbo.JobSplit", new[] { "CreatedById" });
            DropIndex("dbo.JobSplit", new[] { "SidMachineId" });
            DropIndex("dbo.JobSplit", new[] { "DepartmentId" });
            DropIndex("dbo.JobSplit", new[] { "JobTrackerId" });
            DropIndex("dbo.CardHeldAnalysis", new[] { "ModifiedById" });
            DropIndex("dbo.CardHeldAnalysis", new[] { "CreatedById" });
            DropIndex("dbo.CardHeldAnalysis", new[] { "WasteByUnitId" });
            DropIndex("dbo.CardHeldAnalysis", new[] { "JobSplitId" });
            DropIndex("dbo.CardHeldAnalysis", new[] { "JobTrackerId" });
            DropIndex("dbo.CardDeliveryLog", new[] { "ConfirmedById" });
            DropIndex("dbo.CardDeliveryLog", new[] { "CreatedById" });
            DropIndex("dbo.CardDeliveryLog", new[] { "CardDeliveryId" });
            DropIndex("dbo.CardDeliveryLog", new[] { "JobTrackerId" });
            DropIndex("dbo.SidClient", new[] { "SectorId" });
            DropIndex("dbo.Remark", new[] { "SidClientId" });
            DropIndex("dbo.Job", new[] { "JobStatusId" });
            DropIndex("dbo.Job", new[] { "SidCardTypeId" });
            DropIndex("dbo.Job", new[] { "ServiceTypeId" });
            DropIndex("dbo.Job", new[] { "RemarkId" });
            DropIndex("dbo.Job", new[] { "SidClientId" });
            DropIndex("dbo.JobTracker", new[] { "JobStatusId" });
            DropIndex("dbo.JobTracker", new[] { "CustomerServiceId" });
            DropIndex("dbo.JobTracker", new[] { "MAudId" });
            DropIndex("dbo.JobTracker", new[] { "DispatchId" });
            DropIndex("dbo.JobTracker", new[] { "MailingId" });
            DropIndex("dbo.JobTracker", new[] { "QCId" });
            DropIndex("dbo.JobTracker", new[] { "CardEngrResumeId" });
            DropIndex("dbo.JobTracker", new[] { "FirstJobRunId" });
            DropIndex("dbo.JobTracker", new[] { "QAId" });
            DropIndex("dbo.JobTracker", new[] { "CardEngrId" });
            DropIndex("dbo.JobTracker", new[] { "PrintQCId" });
            DropIndex("dbo.JobTracker", new[] { "PrintQAId" });
            DropIndex("dbo.JobTracker", new[] { "PrintingId" });
            DropIndex("dbo.JobTracker", new[] { "InventoryId" });
            DropIndex("dbo.JobTracker", new[] { "CardOpsId" });
            DropIndex("dbo.JobTracker", new[] { "JobId" });
            DropIndex("dbo.AspNetUserRoles", new[] { "RoleId" });
            DropIndex("dbo.AspNetUserRoles", new[] { "UserId" });
            DropIndex("dbo.AspNetUserLogins", new[] { "UserId" });
            DropIndex("dbo.AspNetUserClaims", new[] { "UserId" });
            DropIndex("dbo.AspNetUsers", "UserNameIndex");
            DropIndex("dbo.CardDelivery", new[] { "ConfirmedById" });
            DropIndex("dbo.CardDelivery", new[] { "DeliveredById" });
            DropIndex("dbo.CardDelivery", new[] { "TargetDepartmentId" });
            DropIndex("dbo.CardDelivery", new[] { "DepartmentId" });
            DropIndex("dbo.CardDelivery", new[] { "JobTrackerId" });
            DropTable("dbo.WasteErrorSourceCode");
            DropTable("dbo.StockStatus");
            DropTable("dbo.StationaryInwardGood");
            DropTable("dbo.SidVariant");
            DropTable("dbo.SidChipType");
            DropTable("dbo.Sid09CustomerService");
            DropTable("dbo.Sid08Dispatch");
            DropTable("dbo.MailingMode");
            DropTable("dbo.Sid07Mailing");
            DropTable("dbo.Sid06QC");
            DropTable("dbo.Sid05QA");
            DropTable("dbo.Sid04Printing");
            DropTable("dbo.Sid03FirstCard");
            DropTable("dbo.Sid01CardOps");
            DropTable("dbo.ServerJobQueue");
            DropTable("dbo.AspNetRoles");
            DropTable("dbo.RefreshToken");
            DropTable("dbo.ProductService");
            DropTable("dbo.Priority");
            DropTable("dbo.PrintWasteAnalysis");
            DropTable("dbo.PrintHeldAnalysis");
            DropTable("dbo.PrintDelivery");
            DropTable("dbo.NonPersoJob");
            DropTable("dbo.JobWaste");
            DropTable("dbo.WasteType");
            DropTable("dbo.JobWasteLog");
            DropTable("dbo.JobVariant");
            DropTable("dbo.JobSplitPrintCEAnalysis");
            DropTable("dbo.JobHandler");
            DropTable("dbo.JobFlag");
            DropTable("dbo.IssuanceStatus");
            DropTable("dbo.FlagType");
            DropTable("dbo.Vendor");
            DropTable("dbo.EmbedCardRequest");
            DropTable("dbo.EmbedCardReceipt");
            DropTable("dbo.DictionaryServiceType");
            DropTable("dbo.DictionaryClientName");
            DropTable("dbo.DictionaryCardType");
            DropTable("dbo.DeliveryNoteMaterialAudit");
            DropTable("dbo.DispatchDelivery");
            DropTable("dbo.DeliveryNote");
            DropTable("dbo.DeliveryNoteLog");
            DropTable("dbo.DeliveryProfile");
            DropTable("dbo.DeliveryNoteTemplate");
            DropTable("dbo.DeliveryNoteClientTemplate");
            DropTable("dbo.ClientUser");
            DropTable("dbo.ClientStockLog");
            DropTable("dbo.Client");
            DropTable("dbo.SidProduct");
            DropTable("dbo.ClientVaultReport");
            DropTable("dbo.ClientStockReport");
            DropTable("dbo.ClientReturnLog");
            DropTable("dbo.WasteErrorSource");
            DropTable("dbo.JobSplitCEAnalysis");
            DropTable("dbo.CardWasteAnalysis");
            DropTable("dbo.IssuanceType");
            DropTable("dbo.CardIssuance");
            DropTable("dbo.CardIssuanceLog");
            DropTable("dbo.SidMachine");
            DropTable("dbo.JobSplit");
            DropTable("dbo.CardHeldAnalysis");
            DropTable("dbo.CardDeliveryLog");
            DropTable("dbo.SidCardType");
            DropTable("dbo.ServiceType");
            DropTable("dbo.SidSector");
            DropTable("dbo.SidClient");
            DropTable("dbo.Remark");
            DropTable("dbo.JobStatus");
            DropTable("dbo.Job");
            DropTable("dbo.JobTracker");
            DropTable("dbo.Department");
            DropTable("dbo.AspNetUserRoles");
            DropTable("dbo.AspNetUserLogins");
            DropTable("dbo.AspNetUserClaims");
            DropTable("dbo.AspNetUsers");
            DropTable("dbo.CardDelivery");
            DropTable("dbo.Audience");
        }
    }
}
