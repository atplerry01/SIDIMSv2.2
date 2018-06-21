namespace AuthorizationServer.Api.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class UpdateProductImage : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.SidProduct", "HasImage", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.SidProduct", "HasImage");
        }
    }
}
