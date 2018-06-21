namespace AuthorizationServer.Api.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddImage : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.SidProductImage",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        SidProductId = c.Int(nullable: false),
                        ImagePath = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.SidProductImage");
        }
    }
}
