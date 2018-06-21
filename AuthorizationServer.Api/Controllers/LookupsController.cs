using AuthorizationServer.Api.Infrastructure;
using SID.Common.Model.Lookups;
using System.Data.Entity;
using System.Threading.Tasks;
using System.Web.Http;

namespace AuthorizationServer.Api.Controllers
{
    [RoutePrefix("api/lookups")]
    public class LookupsController : BaseApiController
    {
        ApplicationDbContext context = new ApplicationDbContext();
        
        /// SidCardType
        [Route("cardtype/create")]
        public async Task<IHttpActionResult> CreateCardType(SidCardType entity)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            context.SidCardTypes.Add(entity);
            await context.SaveChangesAsync();

            return Ok<SidCardType>(entity);
        }

        [HttpPut]
        [Route("cardtype/update/{id:int}")]
        public async Task<IHttpActionResult> UpdateCardTypes(int id, [FromBody] SidCardType entity)
        {
            SidCardType existingEntity = await context.SidCardTypes.FindAsync(entity.Id);

            if (entity == null) { return NotFound(); }
            if (id != entity.Id) { return BadRequest(ModelState); }
            if (entity == null)
            {
                return BadRequest(ModelState);
            }

            if (existingEntity != null && context.Entry(existingEntity).State != EntityState.Detached)
            {
                context.Entry(existingEntity).State = EntityState.Detached;
            }

            //Overide entity if exist
            context.SidCardTypes.Attach(entity);
            context.Entry(entity).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok<SidCardType>(entity);
        }

        /// SidChipType
        [Route("chiptype/create")]
        public async Task<IHttpActionResult> CreateChipType(SidChipType entity)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            context.SidChipTypes.Add(entity);
            await context.SaveChangesAsync();

            return Ok<SidChipType>(entity);
        }

        [HttpPut]
        [Route("chiptype/update/{id:int}")]
        public async Task<IHttpActionResult> UpdateChipTypes(int id, [FromBody] SidChipType entity)
        {
            SidChipType existingEntity = await context.SidChipTypes.FindAsync(entity.Id);

            if (entity == null) { return NotFound(); }
            if (id != entity.Id) { return BadRequest(ModelState); }
            if (entity == null)
            {
                return BadRequest(ModelState);
            }

            if (existingEntity != null && context.Entry(existingEntity).State != EntityState.Detached)
            {
                context.Entry(existingEntity).State = EntityState.Detached;
            }

            //Overide entity if exist
            context.SidChipTypes.Attach(entity);
            context.Entry(entity).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok<SidChipType>(entity);
        }




        // SidClients
        [Route("client/create")]
        public async Task<IHttpActionResult> CreateClients(SidClient entity)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            entity.ShortCode = entity.ShortCode.ToUpper();
            context.SidClients.Add(entity);
            await context.SaveChangesAsync();

            return Ok<SidClient>(entity);
        }

        [HttpPut]
        [Route("client/update/{id:int}")]
        public async Task<IHttpActionResult> UpdateSidClients(int id, [FromBody] SidClient entity)
        {
            SidClient existingEntity = await context.SidClients.FindAsync(entity.Id);

            if (entity == null) { return NotFound(); }
            if (id != entity.Id) { return BadRequest(ModelState); }
            if (entity == null)
            {
                return BadRequest(ModelState);
            }

            if (existingEntity != null && context.Entry(existingEntity).State != EntityState.Detached)
            {
                context.Entry(existingEntity).State = EntityState.Detached;
            }

            //Overide entity if exist
            context.SidClients.Attach(entity);
            context.Entry(entity).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok<SidClient>(entity);
        }


        // SidVariant
        [Route("variant/create")]
        public async Task<IHttpActionResult> CreateVariants(SidVariant entity)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            entity.ShortCode = entity.ShortCode.ToUpper();
            entity.Name = entity.Name.ToUpper();

            context.SidVariants.Add(entity);
            await context.SaveChangesAsync();

            return Ok<SidVariant>(entity);
        }

        [HttpPut]
        [Route("variant/update/{id:int}")]
        public async Task<IHttpActionResult> UpdateSidVariants(int id, [FromBody] SidVariant entity)
        {
            SidVariant existingEntity = await context.SidVariants.FindAsync(entity.Id);

            if (entity == null) { return NotFound(); }
            if (id != entity.Id) { return BadRequest(ModelState); }
            if (entity == null)
            {
                return BadRequest(ModelState);
            }

            if (existingEntity != null && context.Entry(existingEntity).State != EntityState.Detached)
            {
                context.Entry(existingEntity).State = EntityState.Detached;
            }

            //Overide entity if exist
            context.SidVariants.Attach(entity);
            context.Entry(entity).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok<SidVariant>(entity);
        }

        //Remarks
        [Route("remark/create")]
        public async Task<IHttpActionResult> CreateRemarks(Remark entity)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            context.Remarks.Add(entity);
            await context.SaveChangesAsync();

            return Ok<Remark>(entity);
        }

        [HttpPut]
        [Route("remark/update/{id:int}")]
        public async Task<IHttpActionResult> UpdateRemarks(int id, [FromBody] Remark entity)
        {
            Remark existingEntity = await context.Remarks.FindAsync(entity.Id);

            if (entity == null) { return NotFound(); }
            if (id != entity.Id) { return BadRequest(ModelState); }
            if (entity == null)
            {
                return BadRequest(ModelState);
            }

            if (existingEntity != null && context.Entry(existingEntity).State != EntityState.Detached)
            {
                context.Entry(existingEntity).State = EntityState.Detached;
            }

            //Overide entity if exist
            context.Remarks.Attach(entity);
            context.Entry(entity).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok<Remark>(entity);
        }



    }
}
