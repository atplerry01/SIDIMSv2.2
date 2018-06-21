namespace AuthorizationServer.Api.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class UpdateWasteLog : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.JobWasteLog", "JobWasteId", c => c.Int(nullable: false));
            CreateIndex("dbo.JobWasteLog", "JobWasteId");
            AddForeignKey("dbo.JobWasteLog", "JobWasteId", "dbo.JobWaste", "Id", cascadeDelete: false);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.JobWasteLog", "JobWasteId", "dbo.JobWaste");
            DropIndex("dbo.JobWasteLog", new[] { "JobWasteId" });
            DropColumn("dbo.JobWasteLog", "JobWasteId");
        }
    }
}
