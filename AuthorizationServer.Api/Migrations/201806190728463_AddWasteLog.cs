namespace AuthorizationServer.Api.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddWasteLog : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.CardWasteAnalysis", "IsWasteDispatch", c => c.Boolean(nullable: false));
            AddColumn("dbo.PrintWasteAnalysis", "IsWasteDispatch", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.PrintWasteAnalysis", "IsWasteDispatch");
            DropColumn("dbo.CardWasteAnalysis", "IsWasteDispatch");
        }
    }
}
