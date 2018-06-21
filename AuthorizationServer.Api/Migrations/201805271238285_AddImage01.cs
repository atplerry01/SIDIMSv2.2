namespace AuthorizationServer.Api.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddImage01 : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.SidProductImage", "ImagePath", c => c.String());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.SidProductImage", "ImagePath", c => c.Int(nullable: false));
        }
    }
}
