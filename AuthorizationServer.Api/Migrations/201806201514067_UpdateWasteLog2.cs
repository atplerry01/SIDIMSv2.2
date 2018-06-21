namespace AuthorizationServer.Api.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class UpdateWasteLog2 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.WasteDeliveryNoteLog", "JobWasteId", "dbo.JobWaste");
            DropIndex("dbo.WasteDeliveryNoteLog", new[] { "JobWasteId" });
            AddColumn("dbo.WasteDeliveryNoteLog", "CardWasteAnalysisId", c => c.Int(nullable: false));
            CreateIndex("dbo.WasteDeliveryNoteLog", "CardWasteAnalysisId");
            AddForeignKey("dbo.WasteDeliveryNoteLog", "CardWasteAnalysisId", "dbo.CardWasteAnalysis", "Id", cascadeDelete: true);
            DropColumn("dbo.WasteDeliveryNoteLog", "JobWasteId");
        }
        
        public override void Down()
        {
            AddColumn("dbo.WasteDeliveryNoteLog", "JobWasteId", c => c.Int(nullable: false));
            DropForeignKey("dbo.WasteDeliveryNoteLog", "CardWasteAnalysisId", "dbo.CardWasteAnalysis");
            DropIndex("dbo.WasteDeliveryNoteLog", new[] { "CardWasteAnalysisId" });
            DropColumn("dbo.WasteDeliveryNoteLog", "CardWasteAnalysisId");
            CreateIndex("dbo.WasteDeliveryNoteLog", "JobWasteId");
            AddForeignKey("dbo.WasteDeliveryNoteLog", "JobWasteId", "dbo.JobWaste", "Id", cascadeDelete: true);
        }
    }
}
