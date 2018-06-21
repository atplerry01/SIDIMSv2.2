namespace AuthorizationServer.Api.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class UpdateProductImage1 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.SidProductImage", "ImageName", c => c.String());
            DropColumn("dbo.SidProductImage", "ImagePath");
        }
        
        public override void Down()
        {
            AddColumn("dbo.SidProductImage", "ImagePath", c => c.String());
            DropColumn("dbo.SidProductImage", "ImageName");
        }
    }
}
