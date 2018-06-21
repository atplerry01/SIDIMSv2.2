namespace AuthorizationServer.Api.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddWasteLog2 : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.WasteDeliveryNoteLog",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        JobWasteId = c.Int(nullable: false),
                        WasteDeliveryNoteId = c.Int(nullable: false),
                        AuditStatus = c.Boolean(nullable: false),
                        CustomerServiceStatus = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.JobWaste", t => t.JobWasteId, cascadeDelete: true)
                .ForeignKey("dbo.WasteDeliveryNote", t => t.WasteDeliveryNoteId, cascadeDelete: true)
                .Index(t => t.JobWasteId)
                .Index(t => t.WasteDeliveryNoteId);
            
            CreateTable(
                "dbo.WasteDeliveryNote",
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
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.WasteDeliveryNoteLog", "WasteDeliveryNoteId", "dbo.WasteDeliveryNote");
            DropForeignKey("dbo.WasteDeliveryNote", "SidClientId", "dbo.SidClient");
            DropForeignKey("dbo.WasteDeliveryNote", "DeliveryProfileId", "dbo.DeliveryProfile");
            DropForeignKey("dbo.WasteDeliveryNote", "CreatedById", "dbo.AspNetUsers");
            DropForeignKey("dbo.WasteDeliveryNoteLog", "JobWasteId", "dbo.JobWaste");
            DropIndex("dbo.WasteDeliveryNote", new[] { "CreatedById" });
            DropIndex("dbo.WasteDeliveryNote", new[] { "DeliveryProfileId" });
            DropIndex("dbo.WasteDeliveryNote", new[] { "SidClientId" });
            DropIndex("dbo.WasteDeliveryNoteLog", new[] { "WasteDeliveryNoteId" });
            DropIndex("dbo.WasteDeliveryNoteLog", new[] { "JobWasteId" });
            DropTable("dbo.WasteDeliveryNote");
            DropTable("dbo.WasteDeliveryNoteLog");
        }
    }
}
