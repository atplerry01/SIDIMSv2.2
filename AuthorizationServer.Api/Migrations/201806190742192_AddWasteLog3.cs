namespace AuthorizationServer.Api.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddWasteLog3 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.JobWaste", "IsDispatch", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.JobWaste", "IsDispatch");
        }
    }
}
