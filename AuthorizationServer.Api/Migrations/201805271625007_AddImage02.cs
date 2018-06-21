namespace AuthorizationServer.Api.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddImage02 : DbMigration
    {
        public override void Up()
        {
            CreateIndex("dbo.SidProductImage", "SidProductId");
            AddForeignKey("dbo.SidProductImage", "SidProductId", "dbo.SidProduct", "Id", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.SidProductImage", "SidProductId", "dbo.SidProduct");
            DropIndex("dbo.SidProductImage", new[] { "SidProductId" });
        }
    }
}
