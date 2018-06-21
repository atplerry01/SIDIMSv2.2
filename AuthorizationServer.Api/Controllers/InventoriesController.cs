using AuthorizationServer.Api.Infrastructure;
using AuthorizationServer.Api.Models;
using Microsoft.AspNet.Identity;
using SID.Common.Model.Inventory;
using SID.Common.Model.Lookups;
using SID.Common.Model.Production;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace AuthorizationServer.Api.Controllers
{
    [Authorize]
    [RoutePrefix("api/inventory")]
    public class InventoriesController : ApiController
    {
        private readonly ApplicationRepository _repo = null;
        public readonly SidimBreezeRepository _repository = new SidimBreezeRepository();
        ApplicationDbContext context = new ApplicationDbContext();

        public string UserId;
        string userId;

        public InventoriesController()
        {
            _repo = new ApplicationRepository();
        }


        [Route("new/cardissuance/create")]
        public async Task<IHttpActionResult> CreateNewCardIssuance(CardIssuanceModel entity)
        {
            var userId = User.Identity.GetUserId();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            #region Definations

            // Job Type
            var jobTypePersoOnly = _repo.FindJobTypeByName("Perso Only");
            var jobTypePrintingOnly = _repo.FindJobTypeByName("Printing Only");
            var jobTypeMailingOnly = _repo.FindJobTypeByName("Mailing Only");
            var jobTypePrintingAndPerso = _repo.FindJobTypeByName("Printing And Perso");
            var jobTypePrintingPersoAndMailing = _repo.FindJobTypeByName("Printing, Perso And Mailing");
            var jobTypePersoAndMailing = _repo.FindJobTypeByName("Perso And Mailing");
            var jobTypeDispatchOnly = _repo.FindJobTypeByName("Dispatch Only");

            // DEpartment
            var departmentCE = _repo.FindDepartmentByName("Card Engineer");
            var departmentQc = _repo.FindDepartmentByName("Quality Control");
            var departmentMa = _repo.FindDepartmentByName("Mailing");
            var departmentDp = _repo.FindDepartmentByName("Dispatch");
            var departmentInv = _repo.FindDepartmentByName("Inventory");
            var departmentPr = _repo.FindDepartmentByName("Printing");

            // ClientStockLog
            var issuanceStatusCompleted = _repo.FindIssuanceStatusByName("Completed");
            var issuanceTypeNew = _repo.FindIssuanceTypeByName("New Issuance");

            var jobStatusComplete = _repo.FindJobStatusByName("Completed");
            var jobStatusCompleted = jobStatusComplete;
            var jobStatusNotRequired = _repo.FindJobStatusByName("Not Required");
            var jobStatusQueue = _repo.FindJobStatusByName("Queue");
            var jobStatusReverted = _repo.FindJobStatusByName("Reverted");
            var jobStatusPending = _repo.FindJobStatusByName("Pending");

            var issuanceJob = _repo.FindCardIssuanceByJobId(entity.JobId);
            var jobTracker = await context.JobTrackers.FindAsync(entity.JobTrackerId);

            // MIS Requirements
            var job = await context.Jobs.FindAsync(entity.JobId);
            var jobVariant = _repo.FindJobVariantByJobId(job.Id, jobTracker.Id);
            var clientVaultReport = _repo.FindClientVaultReportBySidProductId(jobVariant.SidProductId);
            var clientStockReportForTheDay = _repo.FindClientStocktReportForTheDay(jobVariant.SidProductId, job.JobName);
            var serviceType = job.ServiceTypeId;

            #endregion

            // JobTracker Setups
            #region JobTrackerSetup

            var jobServiceTypeId = job.ServiceTypeId;

            if (jobServiceTypeId == jobTypePersoOnly.Id)
            {
                #region PersoOnly

                jobTracker.CardOpsId = jobStatusComplete.Id;
                jobTracker.CardOpsId = jobStatusComplete.Id;
                jobTracker.InventoryId = jobStatusComplete.Id;
                jobTracker.PrintingId = jobStatusNotRequired.Id;
                jobTracker.PrintQAId = jobStatusNotRequired.Id;
                jobTracker.PrintQCId = jobStatusNotRequired.Id;
                jobTracker.CardEngrId = jobStatusQueue.Id;
                jobTracker.QAId = jobStatusPending.Id;
                jobTracker.FirstJobRunId = jobStatusQueue.Id;
                jobTracker.CardEngrResumeId = jobStatusPending.Id;
                jobTracker.QCId = jobStatusPending.Id;
                jobTracker.MailingId = jobStatusNotRequired.Id;
                jobTracker.DispatchId = jobStatusPending.Id;
                jobTracker.CustomerServiceId = jobStatusPending.Id;
                jobTracker.MAudId = jobStatusPending.Id;

                context.JobTrackers.Attach(jobTracker);
                context.Entry(jobTracker).State = EntityState.Modified;
                await context.SaveChangesAsync();

                #endregion

            }
            else if (jobServiceTypeId == jobTypePrintingOnly.Id)
            {
                #region PrintOnly
                // Non Perso Job
                jobTracker.CardOpsId = jobStatusCompleted.Id;
                jobTracker.InventoryId = jobStatusCompleted.Id;
                jobTracker.PrintingId = jobStatusQueue.Id;
                jobTracker.PrintQAId = jobStatusPending.Id;
                jobTracker.PrintQCId = jobStatusPending.Id;
                jobTracker.CardEngrId = jobStatusNotRequired.Id;
                jobTracker.QAId = jobStatusNotRequired.Id;
                jobTracker.FirstJobRunId = jobStatusNotRequired.Id;
                jobTracker.CardEngrResumeId = jobStatusNotRequired.Id;
                jobTracker.QCId = jobStatusNotRequired.Id;
                jobTracker.MailingId = jobStatusNotRequired.Id;
                jobTracker.DispatchId = jobStatusPending.Id; //Create dispatch setups
                jobTracker.MAudId = jobStatusPending.Id;
                jobTracker.CustomerServiceId = jobStatusPending.Id;

                context.JobTrackers.Attach(jobTracker);
                context.Entry(jobTracker).State = EntityState.Modified;
                await context.SaveChangesAsync();
                #endregion

            }
            else if (jobServiceTypeId == jobTypeMailingOnly.Id)
            {
                #region MailingOnly

                jobTracker.CardOpsId = jobStatusCompleted.Id;
                jobTracker.InventoryId = jobStatusCompleted.Id;
                jobTracker.PrintingId = jobStatusNotRequired.Id;
                jobTracker.PrintQAId = jobStatusNotRequired.Id;
                jobTracker.PrintQCId = jobStatusNotRequired.Id;
                jobTracker.CardEngrId = jobStatusNotRequired.Id;
                jobTracker.QAId = jobStatusNotRequired.Id;
                jobTracker.FirstJobRunId = jobStatusNotRequired.Id;
                jobTracker.CardEngrResumeId = jobStatusNotRequired.Id;
                jobTracker.QCId = jobStatusNotRequired.Id;
                jobTracker.MailingId = jobStatusQueue.Id;
                jobTracker.DispatchId = jobStatusPending.Id; //Create dispatch setups
                jobTracker.MAudId = jobStatusPending.Id;
                jobTracker.CustomerServiceId = jobStatusPending.Id;
                
                context.JobTrackers.Attach(jobTracker);
                context.Entry(jobTracker).State = EntityState.Modified;
                await context.SaveChangesAsync();

                #endregion

            }
            else if (jobServiceTypeId == jobTypeDispatchOnly.Id)
            {
                #region DispatchOnly
                jobTracker.CardOpsId = jobStatusCompleted.Id;
                jobTracker.InventoryId = jobStatusCompleted.Id;
                jobTracker.PrintingId = jobStatusNotRequired.Id;
                jobTracker.PrintQAId = jobStatusNotRequired.Id;
                jobTracker.PrintQCId = jobStatusNotRequired.Id;
                jobTracker.CardEngrId = jobStatusNotRequired.Id;
                jobTracker.QAId = jobStatusNotRequired.Id;
                jobTracker.FirstJobRunId = jobStatusNotRequired.Id;
                jobTracker.CardEngrResumeId = jobStatusNotRequired.Id;
                jobTracker.QCId = jobStatusNotRequired.Id;
                jobTracker.MailingId = jobStatusNotRequired.Id;
                jobTracker.DispatchId = jobStatusQueue.Id;
                jobTracker.MAudId = jobStatusPending.Id;
                jobTracker.CustomerServiceId = jobStatusPending.Id;
                
                context.JobTrackers.Attach(jobTracker);
                context.Entry(jobTracker).State = EntityState.Modified;
                await context.SaveChangesAsync();

                #endregion

            }
            else if (jobServiceTypeId == jobTypePrintingAndPerso.Id)
            {
                #region PersoPrinting

                jobTracker.CardOpsId = jobStatusCompleted.Id;
                jobTracker.InventoryId = jobStatusCompleted.Id;
                jobTracker.PrintingId = jobStatusQueue.Id;
                jobTracker.PrintQAId = jobStatusPending.Id;
                jobTracker.PrintQCId = jobStatusPending.Id;
                jobTracker.CardEngrId = jobStatusPending.Id;
                jobTracker.QAId = jobStatusPending.Id;
                jobTracker.FirstJobRunId = jobStatusPending.Id;
                jobTracker.CardEngrResumeId = jobStatusPending.Id;
                jobTracker.QCId = jobStatusPending.Id;
                jobTracker.MailingId = jobStatusNotRequired.Id;
                jobTracker.DispatchId = jobStatusPending.Id; //Create dispatch setups
                jobTracker.MAudId = jobStatusPending.Id;
                jobTracker.CustomerServiceId = jobStatusPending.Id;
                
                context.JobTrackers.Attach(jobTracker);
                context.Entry(jobTracker).State = EntityState.Modified;
                await context.SaveChangesAsync();

                #endregion

            }
            else if (jobServiceTypeId == jobTypePersoAndMailing.Id)
            {
                #region PersoAndMailing

                jobTracker.CardOpsId = jobStatusCompleted.Id;
                jobTracker.InventoryId = jobStatusCompleted.Id;
                jobTracker.PrintingId = jobStatusNotRequired.Id;
                jobTracker.PrintQAId = jobStatusNotRequired.Id;
                jobTracker.PrintQCId = jobStatusNotRequired.Id;
                jobTracker.CardEngrId = jobStatusQueue.Id;
                jobTracker.QAId = jobStatusPending.Id;
                jobTracker.FirstJobRunId = jobStatusQueue.Id;
                jobTracker.CardEngrResumeId = jobStatusPending.Id;
                jobTracker.QCId = jobStatusPending.Id;
                jobTracker.MailingId = jobStatusPending.Id;
                jobTracker.DispatchId = jobStatusPending.Id;
                jobTracker.MAudId = jobStatusPending.Id;
                jobTracker.CustomerServiceId = jobStatusPending.Id;

                context.JobTrackers.Attach(jobTracker);
                context.Entry(jobTracker).State = EntityState.Modified;
                await context.SaveChangesAsync();

                #endregion

            }
            else if (jobServiceTypeId == jobTypePrintingPersoAndMailing.Id)
            {
                #region PersoAndMailing

                jobTracker.CardOpsId = jobStatusCompleted.Id;
                jobTracker.InventoryId = jobStatusCompleted.Id;
                jobTracker.PrintingId = jobStatusQueue.Id;
                jobTracker.PrintQAId = jobStatusPending.Id;
                jobTracker.PrintQCId = jobStatusPending.Id;
                jobTracker.CardEngrId = jobStatusPending.Id;
                jobTracker.QAId = jobStatusPending.Id;
                jobTracker.FirstJobRunId = jobStatusPending.Id;
                jobTracker.CardEngrResumeId = jobStatusPending.Id;
                jobTracker.QCId = jobStatusPending.Id;
                jobTracker.MailingId = jobStatusPending.Id;
                jobTracker.DispatchId = jobStatusPending.Id;
                jobTracker.MAudId = jobStatusPending.Id;
                jobTracker.CustomerServiceId = jobStatusPending.Id;

                context.JobTrackers.Attach(jobTracker);
                context.Entry(jobTracker).State = EntityState.Modified;
                await context.SaveChangesAsync();
                #endregion
            }

            #endregion
            
            #region Validator

            if (entity.TotalQuantityIssued > job.Quantity)
            {
                var message = string.Format("Issuance exceed Job Quantity");
                var err = new HttpError(message);
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, err));

            }

            if (entity.TotalQuantity > job.Quantity)
            {
                return BadRequest(ModelState);
            }

            if (clientVaultReport == null)
            {
                var message = string.Format("Client Stock Vault does not exist");
                var err = new HttpError(message);
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, err));

            }

            if (clientVaultReport.ClosingStock < entity.TotalQuantityIssued)
            {
                var message = string.Format("Client Vault Stock is low");
                var err = new HttpError(message);
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, err));
            }

            if (clientStockReportForTheDay == null)
            {
                //create new
                var newClientStockReport = new ClientStockReport()
                {
                    SidProductId = jobVariant.SidProductId,
                    ClientVaultReportId = clientVaultReport.Id,
                    FileName = job.JobName,
                    QtyIssued = 0,
                    WasteQty = 0,
                    ReturnQty = 0,
                    OpeningStock = 0,
                    ClosingStock = 0,
                    CreatedOn = DateTime.Now
                };
                var csr = await CreateClientStockReport(newClientStockReport);

            }

            #endregion

            #region IssuanceRegion

            if (job != null)
            {
                // If the JobStatus == Reverted
                if (issuanceJob == null && job.JobStatusId != jobStatusReverted.Id)
                {
                    // get a new one
                    var clientStockReportForTheDay2 = _repo.FindClientStocktReportForTheDay(jobVariant.SidProductId, job.JobName);
                    var quantityRemaining = job.Quantity - entity.TotalQuantityIssued;

                    // Issueance Section
                    //==================
                    if (job.Quantity == entity.TotalQuantityIssued)
                    {
                        // Complete Issuance
                        #region GeneralIssuanceRegion

                        // Create CardIssuance
                        var newCardIssuance = new CardIssuance()
                        {
                            JobId = entity.JobId,
                            IssuanceId = userId, //entity.IssuanceId,
                            IssuanceStatusId = issuanceStatusCompleted.Id,
                            CollectorId = entity.CollectorId,
                            TotalQuantity = job.Quantity,
                            TotalQuantityIssued = entity.TotalQuantityIssued,
                            TotalQuantityRemain = quantityRemaining //entity.TotalQuantityRemain //todo: should not be from client
                        };
                        var t3 = await CreateCardIssuance(newCardIssuance);

                        var lastIssuance = _repository.CardIssuances.Where(i => i.JobId == job.Id).OrderByDescending(x => x.Id).Take(1).ToList();

                        var newCardIssuanceLog = new CardIssuanceLog()
                        {
                            JobTrackerId = jobTracker.Id,
                            CardIssuanceId = lastIssuance[0].Id,
                            IssuanceTypeId = issuanceTypeNew.Id,
                            TotalQuantity = lastIssuance[0].TotalQuantity,
                            QuantityIssued = lastIssuance[0].TotalQuantityIssued,
                            QuantityRemain = lastIssuance[0].TotalQuantityRemain,
                            IssuanceId = userId,
                            CollectorId = entity.CollectorId,
                            IssuedDate = DateTime.Now
                        };
                        await CreateCardIssuanceLog(newCardIssuanceLog);

                        // Stock Log
                        //============
                        // Check for today ClientStockReport
                        // Update the Vault and StockReport
                        var updateVault = clientVaultReport;
                        updateVault.OpeningStock = updateVault.ClosingStock;
                        updateVault.ClosingStock -= entity.TotalQuantityIssued;

                        await UpdateClientVaultReport(updateVault.Id, updateVault);

                        var newClientStockLog = new ClientStockLog()
                        {
                            ClientStockReportId = clientStockReportForTheDay2.Id,
                            CardIssuanceId = lastIssuance[0].Id,
                            IssuanceQty = entity.TotalQuantityIssued,
                            OpeningStock = updateVault.OpeningStock,
                            ClosingStock = updateVault.OpeningStock - entity.TotalQuantityIssued
                        };

                        await CreateClientStockLog(newClientStockLog);

                        var updateDayStock = clientStockReportForTheDay2;
                        updateDayStock.FileName = job.JobName;
                        updateDayStock.QtyIssued += entity.TotalQuantityIssued;
                        updateDayStock.TotalQtyIssued += entity.TotalQuantityIssued;
                        updateDayStock.OpeningStock = updateVault.OpeningStock;
                        updateDayStock.ClosingStock = updateVault.OpeningStock - entity.TotalQuantityIssued;
                        updateDayStock.CreatedOn = DateTime.Now;

                        await UpdateClientStockReport(updateDayStock.Id, updateDayStock);
                        
                        #endregion

                        // Update IsJobPartial Status
                        var updateJob = job;
                        updateJob.IsJobPartial = false;
                        await UpdateJob(updateJob.Id, updateJob);

                        // Update JobTracker
                        var updateJobTracker = jobTracker;
                        updateJobTracker.InventoryId = jobStatusComplete.Id;
                        await UpdateJobTracker(updateJobTracker.Id, updateJobTracker);

                    }
                    else
                    {
                        // Partial Issuance
                        #region GeneralIssuanceRegion

                        // Create CardIssuance
                        var newCardIssuance = new CardIssuance()
                        {
                            JobId = entity.JobId,
                            IssuanceId = userId, //entity.IssuanceId,
                            IssuanceStatusId = issuanceStatusCompleted.Id,
                            CollectorId = entity.CollectorId,
                            TotalQuantity = job.Quantity,
                            TotalQuantityIssued = entity.TotalQuantityIssued,
                            TotalQuantityRemain = quantityRemaining //entity.TotalQuantityRemain //todo: should not be from client
                        };

                        await CreateCardIssuance(newCardIssuance);

                        var lastIssuance = _repository.CardIssuances.Where(i => i.JobId == job.Id).OrderByDescending(x => x.Id).Take(1).ToList();

                        var newCardIssuanceLog = new CardIssuanceLog()
                        {
                            JobTrackerId = jobTracker.Id,
                            CardIssuanceId = lastIssuance[0].Id,
                            IssuanceTypeId = issuanceTypeNew.Id,
                            TotalQuantity = lastIssuance[0].TotalQuantity,
                            QuantityIssued = lastIssuance[0].TotalQuantityIssued,
                            QuantityRemain = lastIssuance[0].TotalQuantityRemain,
                            IssuanceId = userId,
                            CollectorId = entity.CollectorId,
                            IssuedDate = DateTime.Now
                        };
                        await CreateCardIssuanceLog(newCardIssuanceLog);
                        
                        // Stock Log
                        //============
                        // Check for today ClientStockReport
                        // Update the Vault and StockReport

                        var updateVault = clientVaultReport;
                        updateVault.OpeningStock = updateVault.ClosingStock;
                        updateVault.ClosingStock -= entity.TotalQuantityIssued;

                        var t0UpdateClientVault = await UpdateClientVaultReport(updateVault.Id, updateVault);

                        var newClientStockLog = new ClientStockLog()
                        {
                            ClientStockReportId = clientStockReportForTheDay2.Id,
                            CardIssuanceId = lastIssuance[0].Id,
                            IssuanceQty = entity.TotalQuantityIssued,
                            OpeningStock = updateVault.OpeningStock,
                            ClosingStock = updateVault.OpeningStock - entity.TotalQuantityIssued
                        };

                        await CreateClientStockLog(newClientStockLog);

                        var updateDayStock = clientStockReportForTheDay2;
                        updateDayStock.FileName = job.JobName;
                        updateDayStock.QtyIssued += entity.TotalQuantityIssued;
                        updateDayStock.TotalQtyIssued += entity.TotalQuantityIssued;
                        updateDayStock.OpeningStock = updateVault.OpeningStock;
                        updateDayStock.ClosingStock = updateVault.OpeningStock - entity.TotalQuantityIssued;
                        updateDayStock.CreatedOn = DateTime.Now;

                        await UpdateClientStockReport(updateDayStock.Id, updateDayStock);


                        #endregion

                        // Update IsJobPartial Status
                        var updateJob = job;
                        updateJob.IsJobPartial = true;
                        var t0 = await UpdateJob(updateJob.Id, updateJob);

                        // Update JobTracker
                        var updateJobTracker = jobTracker;
                        updateJobTracker.InventoryId = jobStatusComplete.Id;
                        var t1 = await UpdateJobTracker(updateJobTracker.Id, updateJobTracker);

                    }
                } else if (issuanceJob != null && job.JobStatusId == jobStatusReverted.Id)
                {
                    /// For Reverted Jobs
                    // get a new one
                    var clientStockReportForTheDay2 = _repo.FindClientStocktReportForTheDay(jobVariant.SidProductId, job.JobName);
                    var quantityRemaining = job.Quantity - entity.TotalQuantityIssued;
                    
                    // Issueance Section
                    //==================
                    if (job.Quantity == entity.TotalQuantityIssued)
                    {
                        // Complete Issuance
                        #region GeneralIssuanceRegion

                        var lastIssuance = context.CardIssuances.Where(i => i.JobId == job.Id).OrderByDescending(x => x.Id).Take(1).ToList();
                        var cardIssuance = await context.CardIssuances.Where(c => c.JobId == job.Id).SingleOrDefaultAsync();

                        var newCardIssuanceLog = new CardIssuanceLog()
                        {
                            JobTrackerId = jobTracker.Id,
                            CardIssuanceId = cardIssuance.Id,
                            IssuanceTypeId = issuanceTypeNew.Id,
                            TotalQuantity = cardIssuance.TotalQuantity,
                            QuantityIssued = entity.TotalQuantityIssued,
                            QuantityRemain = quantityRemaining,
                            IssuanceId = userId,
                            CollectorId = entity.CollectorId,
                            IssuedDate = DateTime.Now
                        };
                        await CreateCardIssuanceLog(newCardIssuanceLog);

                        // Stock Log
                        //============
                        // Check for today ClientStockReport
                        // Update the Vault and StockReport
                        var updateVault = clientVaultReport;
                        updateVault.OpeningStock = updateVault.ClosingStock;
                        updateVault.ClosingStock -= entity.TotalQuantityIssued;

                        await UpdateClientVaultReport(updateVault.Id, updateVault);

                        var newClientStockLog = new ClientStockLog()
                        {
                            ClientStockReportId = clientStockReportForTheDay2.Id,
                            CardIssuanceId = cardIssuance.Id,
                            IssuanceQty = entity.TotalQuantityIssued,
                            OpeningStock = updateVault.OpeningStock,
                            ClosingStock = updateVault.OpeningStock - entity.TotalQuantityIssued
                        };

                        await CreateClientStockLog(newClientStockLog);

                        var updateDayStock = clientStockReportForTheDay2;
                        updateDayStock.FileName = job.JobName;
                        updateDayStock.QtyIssued += entity.TotalQuantityIssued;
                        updateDayStock.TotalQtyIssued += entity.TotalQuantityIssued;
                        updateDayStock.OpeningStock = updateVault.OpeningStock;
                        updateDayStock.ClosingStock = updateVault.OpeningStock - entity.TotalQuantityIssued;
                        updateDayStock.CreatedOn = DateTime.Now;

                        await UpdateClientStockReport(updateDayStock.Id, updateDayStock);

                        #endregion

                        // Update IsJobPartial Status
                        var updateJob = job;
                        updateJob.IsJobPartial = false;
                        updateJob.JobStatusId = jobStatusPending.Id;
                        await UpdateJob(updateJob.Id, updateJob);

                        // Update JobTracker
                        var updateJobTracker = jobTracker;
                        updateJobTracker.InventoryId = jobStatusComplete.Id;
                        updateJobTracker.JobStatusId = jobStatusPending.Id;
                        await UpdateJobTracker(updateJobTracker.Id, updateJobTracker);

                    }
                    else
                    {
                        // Partial Issuance
                        #region GeneralIssuanceRegion


                        //var lastIssuance = _repository.CardIssuances.Where(i => i.JobId == job.Id).OrderByDescending(x => x.Id).Take(1).ToList();
                        var cardIssuance = await context.CardIssuances.Where(c => c.JobId == job.Id).SingleOrDefaultAsync();

                        var newCardIssuanceLog = new CardIssuanceLog()
                        {
                            JobTrackerId = jobTracker.Id,
                            CardIssuanceId = cardIssuance.Id,
                            IssuanceTypeId = issuanceTypeNew.Id,
                            TotalQuantity = cardIssuance.TotalQuantity,
                            QuantityIssued = entity.TotalQuantityIssued,
                            QuantityRemain = quantityRemaining,
                            IssuanceId = userId,
                            CollectorId = entity.CollectorId,
                            IssuedDate = DateTime.Now
                        };
                        await CreateCardIssuanceLog(newCardIssuanceLog);

                        // Stock Log
                        //============
                        // Check for today ClientStockReport
                        // Update the Vault and StockReport

                        var updateVault = clientVaultReport;
                        updateVault.OpeningStock = updateVault.ClosingStock;
                        updateVault.ClosingStock -= entity.TotalQuantityIssued;

                        var t0UpdateClientVault = await UpdateClientVaultReport(updateVault.Id, updateVault);

                        var newClientStockLog = new ClientStockLog()
                        {
                            ClientStockReportId = clientStockReportForTheDay2.Id,
                            CardIssuanceId = cardIssuance.Id,
                            IssuanceQty = entity.TotalQuantityIssued,
                            OpeningStock = updateVault.OpeningStock,
                            ClosingStock = updateVault.OpeningStock - entity.TotalQuantityIssued
                        };

                        await CreateClientStockLog(newClientStockLog);

                        var updateDayStock = clientStockReportForTheDay2;
                        updateDayStock.FileName = job.JobName;
                        updateDayStock.QtyIssued += entity.TotalQuantityIssued;
                        updateDayStock.TotalQtyIssued += entity.TotalQuantityIssued;
                        updateDayStock.OpeningStock = updateVault.OpeningStock;
                        updateDayStock.ClosingStock = updateVault.OpeningStock - entity.TotalQuantityIssued;
                        updateDayStock.CreatedOn = DateTime.Now;

                        await UpdateClientStockReport(updateDayStock.Id, updateDayStock);


                        #endregion

                        // Update IsJobPartial Status
                        var updateJob = job;
                        updateJob.IsJobPartial = true;
                        var t0 = await UpdateJob(updateJob.Id, updateJob);

                        // Update JobTracker
                        var updateJobTracker = jobTracker;
                        updateJobTracker.InventoryId = jobStatusComplete.Id;
                        var t1 = await UpdateJobTracker(updateJobTracker.Id, updateJobTracker);

                    }
                }
            }

            #endregion

            #region CardDeliveryProcess

            var newCardDelivery = new CardDelivery()
            {
                JobTrackerId = jobTracker.Id,
                DepartmentId = departmentCE.Id,
                TargetDepartmentId = 0,
                DeliveredById = userId,
                DeliveredOn = DateTime.Now,
                ConfirmedById = userId,
                ConfirmedOn = DateTime.Now,
                TotalHeld = 0,
                TotalQuantity = 0,
                TotalWaste = 0,
                IsCompleted = false
            };

            if (serviceType == jobTypePersoOnly.Id)
            {
                // Inv => CE
                var cardDelivery01 = newCardDelivery;
                cardDelivery01.DepartmentId = departmentInv.Id;
                cardDelivery01.TargetDepartmentId = departmentCE.Id;
                await CreateCardDelivery(cardDelivery01);

                // QC => DP
                var cardDelivery02 = newCardDelivery;
                cardDelivery02.DepartmentId = departmentQc.Id;
                cardDelivery02.TargetDepartmentId = departmentDp.Id;
                await CreateCardDelivery(cardDelivery02);
            }
            else if (serviceType == jobTypePrintingOnly.Id)
            {
                // Inv => Pr
                var cardDelivery03 = newCardDelivery;
                cardDelivery03.DepartmentId = departmentInv.Id;
                cardDelivery03.TargetDepartmentId = departmentPr.Id;
                await CreateCardDelivery(cardDelivery03);

                // QC => DP
                var cardDelivery04 = newCardDelivery;
                cardDelivery04.DepartmentId = departmentPr.Id;
                cardDelivery04.TargetDepartmentId = departmentDp.Id;
                await CreateCardDelivery(cardDelivery04);
            }
            else if (serviceType == jobTypeMailingOnly.Id)
            {
                // Inv => MA
                var cardDelivery05 = newCardDelivery;
                cardDelivery05.DepartmentId = departmentInv.Id;
                cardDelivery05.TargetDepartmentId = departmentMa.Id;
                await CreateCardDelivery(cardDelivery05);

                // MA => DP
                var cardDelivery06 = newCardDelivery;
                cardDelivery06.DepartmentId = departmentMa.Id;
                cardDelivery06.TargetDepartmentId = departmentDp.Id;
                await CreateCardDelivery(cardDelivery06);
            }
            else if (serviceType == jobTypeDispatchOnly.Id)
            {
                // Inv => DP
                var cardDelivery07 = newCardDelivery;
                cardDelivery07.DepartmentId = departmentInv.Id;
                cardDelivery07.TargetDepartmentId = departmentDp.Id;
                await CreateCardDelivery(cardDelivery07);

                // Create CardDeliveryLog
                var carddeliveryLog = new CardDeliveryLog()
                {
                    JobTrackerId = entity.JobTrackerId,
                    CardDeliveryId = cardDelivery07.Id,
                    RangeFrom = 1,
                    RangeTo = entity.TotalQuantity,
                    BoxQty = 0,
                    IsConfirmed = false,
                    CreatedById = userId,
                    CreatedOn = DateTime.Now,
                    ConfirmedById = userId,
                    ConfirmedOn = DateTime.Now
                };

                context.CardDeliveryLogs.Add(carddeliveryLog);
                await context.SaveChangesAsync();
            }
            else if (serviceType == jobTypePrintingAndPerso.Id)
            {
                // Inv => Pr
                var cardDelivery08 = newCardDelivery;
                cardDelivery08.DepartmentId = departmentInv.Id;
                cardDelivery08.TargetDepartmentId = departmentPr.Id;
                await CreateCardDelivery(cardDelivery08);

                // Pr => CE
                var cardDelivery09 = newCardDelivery;
                cardDelivery09.DepartmentId = departmentPr.Id;
                cardDelivery09.TargetDepartmentId = departmentCE.Id;
                await CreateCardDelivery(cardDelivery09);

                // QC => DP
                var cardDelivery10 = newCardDelivery;
                cardDelivery10.DepartmentId = departmentQc.Id;
                cardDelivery10.TargetDepartmentId = departmentDp.Id;
                await CreateCardDelivery(cardDelivery10);
            }
            else if (serviceType == jobTypePersoAndMailing.Id)
            {
                // Inv => CE
                var cardDelivery11 = newCardDelivery;
                cardDelivery11.DepartmentId = departmentInv.Id;
                cardDelivery11.TargetDepartmentId = departmentCE.Id;
                await CreateCardDelivery(cardDelivery11);

                // QC => MA
                var cardDelivery12 = newCardDelivery;
                cardDelivery12.DepartmentId = departmentQc.Id;
                cardDelivery12.TargetDepartmentId = departmentMa.Id;
                await CreateCardDelivery(cardDelivery12);

                // MA => DP
                var cardDelivery13 = newCardDelivery;
                cardDelivery13.DepartmentId = departmentMa.Id;
                cardDelivery13.TargetDepartmentId = departmentDp.Id;
                await CreateCardDelivery(cardDelivery13);
            }
            else if (serviceType == jobTypePrintingPersoAndMailing.Id)
            {
                // Inv => PR
                var cardDelivery14 = newCardDelivery;
                cardDelivery14.DepartmentId = departmentInv.Id;
                cardDelivery14.TargetDepartmentId = departmentPr.Id;
                await CreateCardDelivery(cardDelivery14);

                // PR => CE
                var cardDelivery15 = newCardDelivery;
                cardDelivery15.DepartmentId = departmentPr.Id;
                cardDelivery15.TargetDepartmentId = departmentCE.Id;
                await CreateCardDelivery(cardDelivery15);

                // QC => MA
                var cardDelivery16 = newCardDelivery;
                cardDelivery16.DepartmentId = departmentQc.Id;
                cardDelivery16.TargetDepartmentId = departmentMa.Id;
                await CreateCardDelivery(cardDelivery16);

                // MA => DP
                var cardDelivery17 = newCardDelivery;
                cardDelivery17.DepartmentId = departmentMa.Id;
                cardDelivery17.TargetDepartmentId = departmentDp.Id;
                await CreateCardDelivery(cardDelivery17);
            }

            #endregion

            return Ok();
        }

        [Route("partial/cardissuance/create")]
        public async Task<IHttpActionResult> CreatePartialCardIssuance(CardIssuanceModel entity)
        {
            var userId = User.Identity.GetUserId();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            #region Definations

            var jobTypePersoOnly = _repo.FindJobTypeByName("Perso Only");
            var jobTypePrintingOnly = _repo.FindJobTypeByName("Printing Only");
            var jobTypeMailingOnly = _repo.FindJobTypeByName("Mailing Only");
            var jobTypeDispatchOnly = _repo.FindJobTypeByName("Dispatch Only");
            var jobTypePrintingAndPerso = _repo.FindJobTypeByName("Printing And Perso");
            var jobTypePrintingPersoAndMailing = _repo.FindJobTypeByName("Printing, Perso And Mailing");
            var jobTypePersoAndMailing = _repo.FindJobTypeByName("Perso And Mailing");

            var jobStatusPending = _repo.FindJobStatusByName("Pending");
            var jobStatusCompleted = _repo.FindJobStatusByName("Completed");
            var jobStatusQueue = _repo.FindJobStatusByName("Queue");
            var jobStatusNotRequired = _repo.FindJobStatusByName("Not Required");

            // ClientStockLog
            var issuanceTypePartial = _repo.FindIssuanceTypeByName("Partial Issuance");
            var issuanceJob = _repo.FindCardIssuanceByJobId(entity.JobId);

            // MIS Requirements
            var job = await context.Jobs.FindAsync(entity.JobId);
            //var jobTracker = await context.JobTrackers.FindAsync(entity.JobTrackerId);
            var jobVariant = _repo.FindJobVariantByJobId(job.Id, entity.JobTrackerId);
            var clientVaultReport = _repo.FindClientVaultReportBySidProductId(jobVariant.SidProductId);
            var quantityRemaining = job.Quantity - (issuanceJob.TotalQuantityIssued + entity.TotalQuantityIssued);

            #endregion

            #region Validator

            if (entity.TotalQuantity > job.Quantity)
            {
                var message = string.Format("Issuance Miss Match");
                var err = new HttpError(message);
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, err));

            }

            if (clientVaultReport == null)
            {
                var message = string.Format("Client Stock Vault does not exist");
                var err = new HttpError(message);
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, err));

            }

            if (clientVaultReport.ClosingStock < entity.TotalQuantityIssued)
            {
                var message = string.Format("Client Vault Stock is low");
                var err = new HttpError(message);
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, err));

            }

            //Todo: Test
            if (job.Quantity < (issuanceJob.TotalQuantityIssued + entity.TotalQuantityIssued))
            {
                var message = string.Format("Over Issuance");
                var err = new HttpError(message);
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, err));
            }


            #endregion

            #region IssuanceRegion

            // JobTracker Setups
            #region JobTrackerSetup

            var jobServiceTypeId = job.ServiceTypeId;

            if (jobServiceTypeId == jobTypePersoOnly.Id)
            {
                #region PersoOnly

                var jobTrackerPersoOnly = new JobTracker()
                {
                    JobId = job.Id,
                    CardOpsId = jobStatusCompleted.Id,
                    InventoryId = jobStatusCompleted.Id,
                    PrintingId = jobStatusNotRequired.Id,
                    PrintQAId = jobStatusNotRequired.Id,
                    PrintQCId = jobStatusNotRequired.Id,
                    CardEngrId = jobStatusQueue.Id,
                    QAId = jobStatusPending.Id,
                    FirstJobRunId = jobStatusQueue.Id,
                    CardEngrResumeId = jobStatusPending.Id,
                    QCId = jobStatusPending.Id,
                    MailingId = jobStatusNotRequired.Id,
                    DispatchId = jobStatusPending.Id, //Create dispatch setups
                    CustomerServiceId = jobStatusPending.Id,
                    MAudId = jobStatusPending.Id,
                };

                context.JobTrackers.Add(jobTrackerPersoOnly);
                await context.SaveChangesAsync();
                #endregion

            }
            else if (jobServiceTypeId == jobTypePrintingOnly.Id)
            {
                #region PrintOnly
                // Non Perso Job
                var jobTrackerPrintOnly = new JobTracker()
                {
                    JobId = job.Id,
                    CardOpsId = jobStatusCompleted.Id,
                    InventoryId = jobStatusCompleted.Id,
                    PrintingId = jobStatusQueue.Id,
                    PrintQAId = jobStatusPending.Id,
                    PrintQCId = jobStatusPending.Id,
                    CardEngrId = jobStatusNotRequired.Id,
                    QAId = jobStatusNotRequired.Id,
                    FirstJobRunId = jobStatusNotRequired.Id,
                    CardEngrResumeId = jobStatusNotRequired.Id,
                    QCId = jobStatusNotRequired.Id,
                    MailingId = jobStatusNotRequired.Id,
                    DispatchId = jobStatusPending.Id, //Create dispatch setups
                    MAudId = jobStatusPending.Id,
                    CustomerServiceId = jobStatusPending.Id
                };

                context.JobTrackers.Add(jobTrackerPrintOnly);
                await context.SaveChangesAsync();
                #endregion
            }
            else if (jobServiceTypeId == jobTypeMailingOnly.Id)
            {
                #region MailingOnly
                var jobTrackerMailingOnly = new JobTracker()
                {
                    JobId = job.Id,
                    CardOpsId = jobStatusCompleted.Id,
                    InventoryId = jobStatusCompleted.Id,
                    PrintingId = jobStatusNotRequired.Id,
                    PrintQAId = jobStatusNotRequired.Id,
                    PrintQCId = jobStatusNotRequired.Id,
                    CardEngrId = jobStatusNotRequired.Id,
                    QAId = jobStatusNotRequired.Id,
                    FirstJobRunId = jobStatusNotRequired.Id,
                    CardEngrResumeId = jobStatusNotRequired.Id,
                    QCId = jobStatusNotRequired.Id,
                    MailingId = jobStatusQueue.Id,
                    DispatchId = jobStatusPending.Id, //Create dispatch setups
                    MAudId = jobStatusPending.Id,
                    CustomerServiceId = jobStatusPending.Id
                };

                context.JobTrackers.Add(jobTrackerMailingOnly);
                await context.SaveChangesAsync();
                #endregion

            }
            else if (jobServiceTypeId == jobTypeDispatchOnly.Id)
            {
                #region DispatchOnly
                var jobTrackerMailingOnly = new JobTracker()
                {
                    JobId = job.Id,
                    CardOpsId = jobStatusCompleted.Id,
                    InventoryId = jobStatusCompleted.Id,
                    PrintingId = jobStatusNotRequired.Id,
                    PrintQAId = jobStatusNotRequired.Id,
                    PrintQCId = jobStatusNotRequired.Id,
                    CardEngrId = jobStatusNotRequired.Id,
                    QAId = jobStatusNotRequired.Id,
                    FirstJobRunId = jobStatusNotRequired.Id,
                    CardEngrResumeId = jobStatusNotRequired.Id,
                    QCId = jobStatusNotRequired.Id,
                    MailingId = jobStatusNotRequired.Id,
                    DispatchId = jobStatusQueue.Id, //Create dispatch setups
                    MAudId = jobStatusPending.Id,
                    CustomerServiceId = jobStatusPending.Id
                };

                context.JobTrackers.Add(jobTrackerMailingOnly);
                await context.SaveChangesAsync();
                #endregion

            }
            else if (jobServiceTypeId == jobTypePrintingAndPerso.Id)
            {
                #region PersoPrinting
                var jobTrackerPersoPrinting = new JobTracker()
                {
                    JobId = job.Id,
                    CardOpsId = jobStatusCompleted.Id,
                    InventoryId = jobStatusCompleted.Id,
                    PrintingId = jobStatusQueue.Id,
                    PrintQAId = jobStatusPending.Id,
                    PrintQCId = jobStatusPending.Id,
                    CardEngrId = jobStatusPending.Id,
                    QAId = jobStatusPending.Id,
                    FirstJobRunId = jobStatusPending.Id,
                    CardEngrResumeId = jobStatusPending.Id,
                    QCId = jobStatusPending.Id,
                    MailingId = jobStatusNotRequired.Id,
                    DispatchId = jobStatusPending.Id, //Create dispatch setups
                    MAudId = jobStatusPending.Id,
                    CustomerServiceId = jobStatusPending.Id                 
                };

                context.JobTrackers.Add(jobTrackerPersoPrinting);
                await context.SaveChangesAsync();
                #endregion

            }
            else if (jobServiceTypeId == jobTypePersoAndMailing.Id)
            {
                #region PersoAndMailing
                var jobTrackerPersoOnly = new JobTracker()
                {
                    JobId = job.Id,
                    CardOpsId = jobStatusCompleted.Id,
                    InventoryId = jobStatusCompleted.Id,
                    PrintingId = jobStatusNotRequired.Id,
                    PrintQAId = jobStatusNotRequired.Id,
                    PrintQCId = jobStatusNotRequired.Id,
                    CardEngrId = jobStatusQueue.Id,
                    QAId = jobStatusPending.Id,
                    FirstJobRunId = jobStatusQueue.Id,
                    CardEngrResumeId = jobStatusPending.Id,
                    QCId = jobStatusPending.Id,
                    MailingId = jobStatusPending.Id,
                    DispatchId = jobStatusPending.Id,
                    MAudId = jobStatusPending.Id,
                    CustomerServiceId = jobStatusPending.Id                  
                };

                context.JobTrackers.Add(jobTrackerPersoOnly);
                await context.SaveChangesAsync();
                #endregion

            }
            else if (jobServiceTypeId == jobTypePrintingPersoAndMailing.Id)
            {
                #region PersoAndMailing

                var jobTrackerPersoOnly = new JobTracker()
                {
                    JobId = job.Id,
                    CardOpsId = jobStatusCompleted.Id,
                    InventoryId = jobStatusCompleted.Id,
                    PrintingId = jobStatusQueue.Id,
                    PrintQAId = jobStatusPending.Id,
                    PrintQCId = jobStatusPending.Id,
                    CardEngrId = jobStatusPending.Id,
                    QAId = jobStatusPending.Id,
                    FirstJobRunId = jobStatusPending.Id,
                    CardEngrResumeId = jobStatusPending.Id,
                    QCId = jobStatusPending.Id,
                    MailingId = jobStatusPending.Id,
                    DispatchId = jobStatusPending.Id,
                    MAudId = jobStatusPending.Id,
                    CustomerServiceId = jobStatusPending.Id                   
                };

                context.JobTrackers.Add(jobTrackerPersoOnly);
                await context.SaveChangesAsync();
                #endregion
            }

            #endregion

            var lastJobTracker = _repository.JobTrackers.Where(i => i.JobId == job.Id).OrderByDescending(x => x.Id).Take(1).ToList();
            var clientStockReportForTheDay2 = _repo.FindClientStocktReportForTheDay(jobVariant.SidProductId, job.JobName);

            // Complete Issuance
            if (job.Quantity == (issuanceJob.TotalQuantityIssued + entity.TotalQuantityIssued))
            {
                // Complete Issuance
                #region GeneralIssuanceRegion

                // Update Issuance
                issuanceJob.TotalQuantityIssued += entity.TotalQuantityIssued;
                issuanceJob.TotalQuantityRemain = quantityRemaining;
                var t33 = await UpdateCardIssuance(issuanceJob.Id, issuanceJob);

                // Create Logs
                var newCardIssuanceLog = new CardIssuanceLog()
                {
                    JobTrackerId = lastJobTracker[0].Id,
                    CardIssuanceId = issuanceJob.Id,
                    IssuanceTypeId = issuanceTypePartial.Id,
                    TotalQuantity = job.Quantity,
                    QuantityIssued = entity.TotalQuantityIssued,
                    QuantityRemain = quantityRemaining,
                    IssuanceId = userId,
                    CollectorId = entity.CollectorId,
                    IssuedDate = DateTime.Now
                };
                var t4 = await CreateCardIssuanceLog(newCardIssuanceLog);


                // Stock Log
                //============
                // Check for today ClientStockReport
                // Update the Vault and StockReport
                var updateVault = clientVaultReport;
                updateVault.OpeningStock = updateVault.ClosingStock;
                updateVault.ClosingStock -= entity.TotalQuantityIssued;

                var t0UpdateClientVault = await UpdateClientVaultReport(updateVault.Id, updateVault);

                var newClientStockLog = new ClientStockLog()
                {
                    ClientStockReportId = clientStockReportForTheDay2.Id,
                    CardIssuanceId = issuanceJob.Id,
                    IssuanceQty = entity.TotalQuantityIssued,
                    OpeningStock = updateVault.OpeningStock,
                    ClosingStock = updateVault.OpeningStock - entity.TotalQuantityIssued
                };

                await CreateClientStockLog(newClientStockLog);

                var updateDayStock = clientStockReportForTheDay2;
                updateDayStock.FileName = job.JobName;
                updateDayStock.QtyIssued += entity.TotalQuantityIssued;
                updateDayStock.TotalQtyIssued += entity.TotalQuantityIssued;
                updateDayStock.OpeningStock = updateVault.OpeningStock;
                updateDayStock.ClosingStock = updateVault.OpeningStock - entity.TotalQuantityIssued;
                updateDayStock.CreatedOn = DateTime.Now;

                await UpdateClientStockReport(updateDayStock.Id, updateDayStock);
                
                #endregion

                var updateJob = job;
                updateJob.IsJobPartial = false;
                await UpdateJob(updateJob.Id, updateJob);
            }
            else
            {
                // Partial Issuance
                #region GeneralIssuanceRegion

                // Update Issuance
                issuanceJob.TotalQuantityIssued += entity.TotalQuantityIssued;
                issuanceJob.TotalQuantityRemain = quantityRemaining;
                var t33 = await UpdateCardIssuance(issuanceJob.Id, issuanceJob);

                // Create Logs
                var newCardIssuanceLog = new CardIssuanceLog()
                {
                    JobTrackerId = lastJobTracker[0].Id,
                    CardIssuanceId = issuanceJob.Id,
                    IssuanceTypeId = issuanceTypePartial.Id,
                    TotalQuantity = job.Quantity,
                    QuantityIssued = entity.TotalQuantityIssued,
                    QuantityRemain = quantityRemaining,
                    IssuanceId = userId,
                    CollectorId = entity.CollectorId,
                    IssuedDate = DateTime.Now
                };
                var t4 = await CreateCardIssuanceLog(newCardIssuanceLog);

                // Stock Log
                //============
                // Check for today ClientStockReport
                // Update the Vault and StockReport

                var updateVault = clientVaultReport;
                updateVault.OpeningStock = updateVault.ClosingStock;
                updateVault.ClosingStock -= entity.TotalQuantityIssued;

                var t0UpdateClientVault = await UpdateClientVaultReport(updateVault.Id, updateVault);


                ///////

                if (clientStockReportForTheDay2 == null)
                {
                    // create new for today
                    var newClientStockReport = new ClientStockReport()
                    {
                        SidProductId = jobVariant.SidProductId,
                        ClientVaultReportId = clientVaultReport.Id,
                        FileName = job.JobName,
                        QtyIssued = entity.TotalQuantityIssued,
                        TotalQtyIssued = entity.TotalQuantityIssued,
                        WasteQty = 0,
                        ReturnQty = 0,
                        OpeningStock = updateVault.OpeningStock,
                        ClosingStock = updateVault.OpeningStock - entity.TotalQuantityIssued,
                        CreatedOn = DateTime.Now
                    };
                    var csr = await CreateClientStockReport(newClientStockReport);

                    var lastStockReport = _repository.ClientStockReports.OrderByDescending(x => x.Id).Take(1).ToList();


                    var newClientStockLog = new ClientStockLog()
                    {
                        ClientStockReportId = lastStockReport[0].Id,
                        CardIssuanceId = issuanceJob.Id,
                        IssuanceQty = entity.TotalQuantityIssued,
                        OpeningStock = updateVault.OpeningStock,
                        ClosingStock = updateVault.OpeningStock - entity.TotalQuantityIssued
                    };

                    var t2StockLog = await CreateClientStockLog(newClientStockLog);


                }
                else
                {
                    // Update the report for today
                    var updateDayStock = clientStockReportForTheDay2;
                    updateDayStock.FileName = job.JobName;
                    updateDayStock.QtyIssued += entity.TotalQuantityIssued;
                    updateDayStock.TotalQtyIssued += entity.TotalQuantityIssued;
                    updateDayStock.OpeningStock = updateVault.OpeningStock;
                    updateDayStock.ClosingStock = updateVault.OpeningStock - entity.TotalQuantityIssued;
                    updateDayStock.CreatedOn = DateTime.Now;

                    var t1ClientStock = await UpdateClientStockReport(updateDayStock.Id, updateDayStock);


                    /////
                    var newClientStockLog = new ClientStockLog()
                    {
                        ClientStockReportId = clientStockReportForTheDay2.Id,
                        CardIssuanceId = issuanceJob.Id,
                        IssuanceQty = entity.TotalQuantityIssued,
                        OpeningStock = updateVault.OpeningStock,
                        ClosingStock = updateVault.OpeningStock - entity.TotalQuantityIssued
                    };

                    var t2StockLog = await CreateClientStockLog(newClientStockLog);

                }


                #endregion

                var updateJob = job;
                updateJob.IsJobPartial = true;
                var t0 = await UpdateJob(updateJob.Id, updateJob);

            }

            #endregion

            #region CardDeliveryProcess

            // DEpartment
            var departmentCE = _repo.FindDepartmentByName("Card Engineer");
            var departmentQc = _repo.FindDepartmentByName("Quality Control");
            var departmentMa = _repo.FindDepartmentByName("Mailing");
            var departmentDp = _repo.FindDepartmentByName("Dispatch");
            var departmentInv = _repo.FindDepartmentByName("Inventory");
            var departmentPr = _repo.FindDepartmentByName("Printing");

            var newCardDelivery = new CardDelivery()
            {
                JobTrackerId = lastJobTracker[0].Id,
                DepartmentId = departmentCE.Id,
                TargetDepartmentId = 0,
                DeliveredById = userId,
                DeliveredOn = DateTime.Now,
                ConfirmedById = userId,
                ConfirmedOn = DateTime.Now,
                TotalHeld = 0,
                TotalQuantity = 0,
                TotalWaste = 0,
                IsCompleted = false
            };

            if (jobServiceTypeId == jobTypePersoOnly.Id)
            {
                // Inv => CE
                var cardDelivery01 = newCardDelivery;
                cardDelivery01.DepartmentId = departmentInv.Id;
                cardDelivery01.TargetDepartmentId = departmentCE.Id;
                cardDelivery01.Remark = "Inv=>CE";
                await CreateCardDelivery(cardDelivery01);

                // QC => DP
                var cardDelivery02 = newCardDelivery;
                cardDelivery02.DepartmentId = departmentQc.Id;
                cardDelivery02.TargetDepartmentId = departmentDp.Id;
                cardDelivery02.Remark = "QC=>DP";
                await CreateCardDelivery(cardDelivery02);
            }
            else if (jobServiceTypeId == jobTypePrintingOnly.Id)
            {
                // Inv => Pr
                var cardDelivery03 = newCardDelivery;
                cardDelivery03.DepartmentId = departmentInv.Id;
                cardDelivery03.TargetDepartmentId = departmentPr.Id;
                cardDelivery03.Remark = "Inv=>Pr";
                await CreateCardDelivery(cardDelivery03);

                // Pr => DP
                var cardDelivery04 = newCardDelivery;
                cardDelivery04.DepartmentId = departmentPr.Id;
                cardDelivery04.TargetDepartmentId = departmentDp.Id;
                cardDelivery04.Remark = "PrQC=>DP";
                await CreateCardDelivery(cardDelivery04);
            }
            else if (jobServiceTypeId == jobTypeMailingOnly.Id)
            {
                // Inv => MA
                var cardDelivery05 = newCardDelivery;
                cardDelivery05.DepartmentId = departmentInv.Id;
                cardDelivery05.TargetDepartmentId = departmentMa.Id;
                cardDelivery05.Remark = "Inv=>MA";
                await CreateCardDelivery(cardDelivery05);

                // MA => DP
                var cardDelivery06 = newCardDelivery;
                cardDelivery06.DepartmentId = departmentMa.Id;
                cardDelivery06.TargetDepartmentId = departmentDp.Id;
                cardDelivery06.Remark = "MA=>DP";
                await CreateCardDelivery(cardDelivery06);
            }
            else if (jobServiceTypeId == jobTypeDispatchOnly.Id)
            {
                // Inv => DP
                var cardDelivery07 = newCardDelivery;
                cardDelivery07.DepartmentId = departmentInv.Id;
                cardDelivery07.TargetDepartmentId = departmentDp.Id;
                await CreateCardDelivery(cardDelivery07);

                // Create CardDeliveryLog
                var carddeliveryLog = new CardDeliveryLog()
                {
                    JobTrackerId = entity.JobTrackerId,
                    CardDeliveryId = cardDelivery07.Id,
                    RangeFrom = 1,
                    RangeTo = entity.TotalQuantity,
                    BoxQty = 0,
                    IsConfirmed = false,
                    CreatedById = userId,
                    CreatedOn = DateTime.Now,
                    ConfirmedById = userId,
                    ConfirmedOn = DateTime.Now
                };

                context.CardDeliveryLogs.Add(carddeliveryLog);
                await context.SaveChangesAsync();
            }
            else if (jobServiceTypeId == jobTypePrintingAndPerso.Id)
            {
                // Inv => Pr
                var cardDelivery08 = newCardDelivery;
                cardDelivery08.DepartmentId = departmentInv.Id;
                cardDelivery08.TargetDepartmentId = departmentPr.Id;
                cardDelivery08.Remark = "Inv=>Pr";
                await CreateCardDelivery(cardDelivery08);

                // Pr => CE
                var cardDelivery09 = newCardDelivery;
                cardDelivery09.DepartmentId = departmentPr.Id;
                cardDelivery09.TargetDepartmentId = departmentCE.Id;
                cardDelivery09.Remark = "PrQC=>CE";
                await CreateCardDelivery(cardDelivery09);

                // QC => DP
                var cardDelivery10 = newCardDelivery;
                cardDelivery10.DepartmentId = departmentQc.Id;
                cardDelivery10.TargetDepartmentId = departmentDp.Id;
                cardDelivery10.Remark = "QC=>DP";
                await CreateCardDelivery(cardDelivery10);
            }
            else if (jobServiceTypeId == jobTypePersoAndMailing.Id)
            {
                // Inv => CE
                var cardDelivery11 = newCardDelivery;
                cardDelivery11.DepartmentId = departmentInv.Id;
                cardDelivery11.TargetDepartmentId = departmentCE.Id;
                cardDelivery11.Remark = "Inv=>CE";
                await CreateCardDelivery(cardDelivery11);

                // QC => MA
                var cardDelivery12 = newCardDelivery;
                cardDelivery12.DepartmentId = departmentQc.Id;
                cardDelivery12.TargetDepartmentId = departmentMa.Id;
                cardDelivery12.Remark = "QC=>MA";
                await CreateCardDelivery(cardDelivery12);

                // MA => DP
                var cardDelivery13 = newCardDelivery;
                cardDelivery13.DepartmentId = departmentMa.Id;
                cardDelivery13.TargetDepartmentId = departmentDp.Id;
                cardDelivery13.Remark = "MA=>DP";
                await CreateCardDelivery(cardDelivery13);
            }
            else if (jobServiceTypeId == jobTypePrintingPersoAndMailing.Id)
            {
                // Inv => PR
                var cardDelivery14 = newCardDelivery;
                cardDelivery14.DepartmentId = departmentInv.Id;
                cardDelivery14.TargetDepartmentId = departmentPr.Id;
                cardDelivery14.Remark = "Inv=>PR";
                await CreateCardDelivery(cardDelivery14);

                // PR => CE
                var cardDelivery15 = newCardDelivery;
                cardDelivery15.DepartmentId = departmentPr.Id;
                cardDelivery15.TargetDepartmentId = departmentCE.Id;
                cardDelivery15.Remark = "PrQC=>CE";
                await CreateCardDelivery(cardDelivery15);

                // QC => MA
                var cardDelivery16 = newCardDelivery;
                cardDelivery16.DepartmentId = departmentQc.Id;
                cardDelivery16.TargetDepartmentId = departmentMa.Id;
                cardDelivery16.Remark = "QC=>MA";
                await CreateCardDelivery(cardDelivery16);

                // MA => DP
                var cardDelivery17 = newCardDelivery;
                cardDelivery17.DepartmentId = departmentMa.Id;
                cardDelivery17.TargetDepartmentId = departmentDp.Id;
                cardDelivery17.Remark = "MA=>DP";
                await CreateCardDelivery(cardDelivery17);
            }

            #endregion

            return Ok();
        }


        [Route("cardrequest/create")]
        public async Task<IHttpActionResult> CreateCardRequest(EmbedCardRequest entity)
        {
            UserId = User.Identity.GetUserId();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            entity.TotalDelivered = 0;
            entity.CreatedById = UserId;

            context.EmbedCardRequests.Add(entity);
            await context.SaveChangesAsync();

            return Ok<EmbedCardRequest>(entity);
        }

        [HttpPut]
        [Route("cardrequest/update/{id:int}")]
        public async Task<IHttpActionResult> UpdateRequest(int id, [FromBody] EmbedCardRequest entity)
        {
            UserId = User.Identity.GetUserId();
            var existingEntity = await context.EmbedCardRequests.FindAsync(entity.Id);

            if (id != entity.Id) { return BadRequest(ModelState); }

            if (existingEntity != null && context.Entry(existingEntity).State != EntityState.Detached)
            {
                context.Entry(existingEntity).State = EntityState.Detached;
            }

            //Overide entity if exist
            entity.CreatedById = UserId;

            context.EmbedCardRequests.Attach(entity);
            context.Entry(entity).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok<EmbedCardRequest>(entity);

        }

        [Route("cardreceipt/create")]
        public async Task<IHttpActionResult> CreateCardReceipt(EmbedCardReceipt entity)
        {

            UserId = User.Identity.GetUserId();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var currentCardRequest = await context.EmbedCardRequests.FindAsync(entity.EmbedCardRequestId);
            var totalQtyDelivered = currentCardRequest?.TotalDelivered + entity.Quantity;

            if (currentCardRequest?.TotalBatchQty < totalQtyDelivered)
            {
                // Exceeded the Request Quantity
                var message = string.Format("Exceeded the Request Quantity");
                var err = new HttpError(message);
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, err));
            }

            entity.SIDReceiverId = UserId;
            entity.TimeOfReceipt = DateTime.Now;

            context.EmbedCardReceipts.Add(entity);
            await context.SaveChangesAsync();

            var lastCardReceipt = _repository.EmbedCardReceipts.OrderByDescending(x => x.Id).Take(1).ToList();
            var currentVault = await context.ClientVaultReports.FindAsync(lastCardReceipt[0].ClientVaultReportId);

            // Update CardRequest
            var updateCardRequest = currentCardRequest;
            if (updateCardRequest != null)
            {
                updateCardRequest.TotalDelivered += entity.Quantity;
                var t0UpdateCardRequest = await UpdateRequest(updateCardRequest.Id, updateCardRequest);
            }


            var updateVault = currentVault;
            if (updateVault != null)
            {
                updateVault.OpeningStock = updateVault.ClosingStock;
                updateVault.ClosingStock += entity.Quantity;
                var t0UpdateClientVault = await UpdateClientVaultReport(updateVault.Id, updateVault);
            }
            
            return Ok<EmbedCardReceipt>(entity);
        }

        [Route("directcard/create")]
        public async Task<IHttpActionResult> CreateDirectCard(DirectCardReceiptModel entity)
        {

            UserId = User.Identity.GetUserId();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var productVault = _repo.FindClientVaultReportBySidProductId(entity.SidProductId);

            if (productVault == null)
            {
                var newClientVaultReport = new ClientVaultReport()
                {
                    SidProductId = entity.SidProductId,
                    OpeningStock = 0,
                    ClosingStock = entity.Quantity,
                    ModifiedOn = DateTime.Now
                };
                await CreateClientVaultReport(newClientVaultReport);

            } else
            {
                //Update Vault
                productVault.OpeningStock = productVault.ClosingStock;
                productVault.ClosingStock += entity.Quantity;
                var t0UpdateClientVault = await UpdateClientVaultReport(productVault.Id, productVault);
            }

            return Ok();
        }


        [HttpPut]
        [Route("cardreceipt/update/{id:int}")]
        public async Task<IHttpActionResult> UpdateCardReceipt(int id, [FromBody] EmbedCardReceipt entity)
        {
            var existingEntity = await context.EmbedCardReceipts.FindAsync(entity.Id);

            if (id != entity.Id) { return BadRequest(ModelState); }
            if (existingEntity != null && context.Entry(existingEntity).State != EntityState.Detached)
            {
                context.Entry(existingEntity).State = EntityState.Detached;
            }

            //Overide entity if exist
            context.EmbedCardReceipts.Attach(entity);
            context.Entry(entity).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok<EmbedCardReceipt>(entity);

        }

        [Route("jobvariant/create")]
        public async Task<IHttpActionResult> CreateClients(JobVariant entity)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            //Check if JovVarient Exist
            var jobVariant = await context.JobVariants.Where(a => a.JobId == entity.JobId && a.JobTrackerId == entity.JobTrackerId).SingleOrDefaultAsync();

            if (jobVariant == null)
            {
                //Create a new entity
                context.JobVariants.Add(entity);
                await context.SaveChangesAsync();
                
            } else
            {
                // Update Entity
                context.JobVariants.Attach(jobVariant);
                context.Entry(jobVariant).State = EntityState.Modified;
                await context.SaveChangesAsync();
            }


            //Update Job
            var job = await context.Jobs.FindAsync(entity.JobId);

            job.ServiceTypeId = entity.ServiceTypeId;

            context.Jobs.Attach(job);
            context.Entry(job).State = EntityState.Modified;
            await context.SaveChangesAsync();

            // Update JobTracker
          

            return Ok<JobVariant>(entity);
        }

      
        [HttpPut]
        [Route("jobvariant/update/{id:int}")]
        public async Task<IHttpActionResult> UpdateJobVariantClients(int id, [FromBody] JobVariant entity)
        {
           var existingEntity = await context.JobVariants.FindAsync(entity.Id);

            if (id != entity.Id) { return BadRequest(ModelState); }

            if (existingEntity != null && context.Entry(existingEntity).State != EntityState.Detached)
            {
                context.Entry(existingEntity).State = EntityState.Detached;
            }
            
            context.JobVariants.Attach(entity);
            context.Entry(entity).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok<JobVariant>(entity);

        }


        [HttpPost]
        [Route("waste/cardissuance/create")]
        public async Task<IHttpActionResult> CreateWasteCardIssuance(CardWasteAnalysis entity)
        {
            var userId = User.Identity.GetUserId();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            #region Definations

            var jobTracker = await context.JobTrackers.FindAsync(entity.JobTrackerId);
            var job = await context.Jobs.FindAsync(jobTracker.JobId);
            var jobCEAnalysis = _repo.FindJobSplitCEJobAnalysisById(entity.JobSplitCEAnalysisId);
            var jobVariant = _repo.FindJobVariantByJobId(job.Id, jobTracker.Id);
            var clientVaultReport = _repo.FindClientVaultReportBySidProductId(jobVariant.SidProductId);
            var clientStockReportForTheDay = _repo.FindClientStocktReportForTheDay(jobVariant.SidProductId, job.JobName);
            var issuanceJob = _repo.FindCardIssuanceByJobId(job.Id);
            var cardWasteAnalysis = await context.CardWasteAnalysis.FindAsync(entity.Id);

            var quantityRemaining = 0;

            // For partial Issuance
            if (job.Quantity < issuanceJob.TotalQuantityIssued)
            {
                quantityRemaining = job.Quantity - (issuanceJob.TotalQuantityIssued + entity.QuantityBad);
            }

            var issuanceTypePartial = _repo.FindIssuanceTypeByName("Partial Issuance");

            #endregion

            #region Validator


            if (entity.QuantityBad > job.Quantity)
            {
                var message = string.Format("Issuance Mis-Match");
                var err = new HttpError(message);
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, err));
            }

            if (clientVaultReport == null)
            {
                var message = string.Format("Client Stock Vault does not exist");
                var err = new HttpError(message);
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, err));

            }

            if (clientVaultReport.ClosingStock < entity.QuantityBad)
            {
                var message = string.Format("Client Vault Stock is low");
                var err = new HttpError(message);
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, err));

            }

            //Todo: Check if it functional
            if (clientStockReportForTheDay == null)
            {
                //create new
                var newClientStockReport = new ClientStockReport()
                {
                    SidProductId = jobVariant.SidProductId,
                    ClientVaultReportId = clientVaultReport.Id,
                    FileName = job.JobName,
                    QtyIssued = 0,
                    WasteQty = 0,
                    ReturnQty = 0,
                    OpeningStock = 0,
                    ClosingStock = 0,
                    CreatedOn = DateTime.Now
                };
                await CreateClientStockReport(newClientStockReport);
            }

            #endregion

            #region IssuanceRegion

            // CEAnalysis
            jobCEAnalysis.QuantityGood += entity.QuantityBad;
            jobCEAnalysis.WasteReturned += entity.QuantityBad;
            context.Entry(jobCEAnalysis).State = EntityState.Modified;
            await context.SaveChangesAsync();

            // Update CardWaste
            var updateCardWaste = cardWasteAnalysis;
            updateCardWaste.IsCardCollected = true;
            updateCardWaste.ModifiedById = userId;
            updateCardWaste.ModifiedOn = DateTime.Now;
            await UpdateCardWasteAnalysis(updateCardWaste.Id, updateCardWaste);

            // MIS Configuration
            var clientStockReportForTheDay2 = _repo.FindClientStocktReportForTheDay(jobVariant.SidProductId, job.JobName);

            // Update CardIssuance
            var updateCardIssuance = issuanceJob;
            updateCardIssuance.TotalWaste += entity.QuantityBad;
            await UpdateCardIssuance(updateCardIssuance.Id, updateCardIssuance);

            //Todo: Create CardIssuanceLog
            var newCardIssuanceLog = new CardIssuanceLog()
            {
                JobTrackerId = jobTracker.Id,
                CardIssuanceId = issuanceJob.Id,
                IssuanceTypeId = issuanceTypePartial.Id,
                TotalQuantity = job.Quantity,
                QuantityIssued = entity.QuantityBad,
                QuantityRemain = quantityRemaining,
                IssuanceId = userId,
                CollectorId = userId, //Todo: entity.CollectorId, !important
                IssuedDate = DateTime.Now
            };
            var t4 = await CreateCardIssuanceLog(newCardIssuanceLog);

            // Update MIS
            //============
            var updateVault = clientVaultReport;
            updateVault.OpeningStock = updateVault.ClosingStock;
            updateVault.ClosingStock -= entity.QuantityBad;
            await UpdateClientVaultReport(updateVault.Id, updateVault);

            var newClientStockLog = new ClientStockLog()
            {
                ClientStockReportId = clientStockReportForTheDay2.Id,
                CardIssuanceId = issuanceJob.Id,
                IssuanceQty = entity.QuantityBad,
                OpeningStock = updateVault.OpeningStock,
                ClosingStock = updateVault.OpeningStock - entity.QuantityBad
            };

            await CreateClientStockLog(newClientStockLog);

            // Update StockReport
            var updateDayStock = clientStockReportForTheDay2;
            updateDayStock.FileName = job.JobName;
            updateDayStock.TotalQtyIssued += entity.QuantityBad;
            updateDayStock.OpeningStock = updateVault.OpeningStock;
            updateDayStock.ClosingStock = updateVault.OpeningStock - entity.QuantityBad;
            updateDayStock.WasteQty += entity.QuantityBad;
            updateDayStock.CreatedOn = DateTime.Now;
            await UpdateClientStockReport(updateDayStock.Id, updateDayStock);

            #endregion

            return Ok();
        }

        [HttpPost]
        [Route("waste/printissuance/create")]
        public async Task<IHttpActionResult> CreateWastePrintIssuance(PrintWasteAnalysis entity)
        {
            var userId = User.Identity.GetUserId();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            #region Definations

            var jobTracker = await context.JobTrackers.FindAsync(entity.JobTrackerId);
            var job = await context.Jobs.FindAsync(jobTracker.JobId);
            var jobPrintCEAnalysis = _repo.FindJobSplitPrintCEJobAnalysisById(entity.JobSplitPrintCEAnalysisId);
            var jobVariant = _repo.FindJobVariantByJobId(job.Id, jobTracker.Id);
            var clientVaultReport = _repo.FindClientVaultReportBySidProductId(jobVariant.SidProductId);
            var clientStockReportForTheDay = _repo.FindClientStocktReportForTheDay(jobVariant.SidProductId, job.JobName);
            var issuanceJob = _repo.FindCardIssuanceByJobId(job.Id);
            var printWasteAnalysis = await context.PrintWasteAnalysis.FindAsync(entity.Id);

            var quantityRemaining = 0;

            // For partial Issuance
            if (job.Quantity < issuanceJob.TotalQuantityIssued)
            {
                quantityRemaining = job.Quantity - (issuanceJob.TotalQuantityIssued + entity.QuantityBad);
            }

            var issuanceTypePartial = _repo.FindIssuanceTypeByName("Partial Issuance");

            #endregion

            #region Validator


            if (entity.QuantityBad > job.Quantity)
            {
                var message = string.Format("Issuance Mis-Match");
                var err = new HttpError(message);
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, err));
            }

            if (clientVaultReport == null)
            {
                var message = string.Format("Client Stock Vault does not exist");
                var err = new HttpError(message);
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, err));

            }

            if (clientVaultReport.ClosingStock < entity.QuantityBad)
            {
                var message = string.Format("Client Vault Stock is low");
                var err = new HttpError(message);
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, err));

            }

            //Todo: Check if it functional
            if (clientStockReportForTheDay == null)
            {
                //create new
                var newClientStockReport = new ClientStockReport()
                {
                    SidProductId = jobVariant.SidProductId,
                    ClientVaultReportId = clientVaultReport.Id,
                    FileName = job.JobName,
                    QtyIssued = 0,
                    WasteQty = 0,
                    ReturnQty = 0,
                    OpeningStock = 0,
                    ClosingStock = 0,
                    CreatedOn = DateTime.Now
                };
                await CreateClientStockReport(newClientStockReport);
            }

            #endregion

            #region IssuanceRegion

            // CEAnalysis
            jobPrintCEAnalysis.QuantityGood += entity.QuantityBad;
            //jobPrintCEAnalysis.QuantityGood = ((jobPrintCEAnalysis.JobSplit.RangeTo - jobPrintCEAnalysis.JobSplit.RangeFrom) + 1) - (jobPrintCEAnalysis.WasteReturned + entity.QuantityBad); //+= entity.QuantityBad;
            jobPrintCEAnalysis.WasteReturned += entity.QuantityBad;
            context.Entry(jobPrintCEAnalysis).State = EntityState.Modified;
            await context.SaveChangesAsync();

            // Update PrintWaste
            var updatePrintWaste = printWasteAnalysis;
            updatePrintWaste.IsCardCollected = true;
            updatePrintWaste.ModifiedById = userId;
            updatePrintWaste.ModifiedOn = DateTime.Now;
            await UpdatePrintWasteAnalysis(updatePrintWaste.Id, updatePrintWaste);

            // MIS Configuration
            var clientStockReportForTheDay2 = _repo.FindClientStocktReportForTheDay(jobVariant.SidProductId, job.JobName);

            // Update CardIssuance
            var updateCardIssuance = issuanceJob;
            updateCardIssuance.TotalWaste += entity.QuantityBad;
            await UpdateCardIssuance(updateCardIssuance.Id, updateCardIssuance);

            //Todo: Create CardIssuanceLog
            var newCardIssuanceLog = new CardIssuanceLog()
            {
                JobTrackerId = jobTracker.Id,
                CardIssuanceId = issuanceJob.Id,
                IssuanceTypeId = issuanceTypePartial.Id,
                TotalQuantity = job.Quantity,
                QuantityIssued = entity.QuantityBad,
                QuantityRemain = quantityRemaining,
                IssuanceId = userId,
                CollectorId = userId, //Todo: entity.CollectorId, !important
                IssuedDate = DateTime.Now
            };
            var t4 = await CreateCardIssuanceLog(newCardIssuanceLog);

            // Update MIS
            //============
            var updateVault = clientVaultReport;
            updateVault.OpeningStock = updateVault.ClosingStock;
            updateVault.ClosingStock -= entity.QuantityBad;
            await UpdateClientVaultReport(updateVault.Id, updateVault);

            var newClientStockLog = new ClientStockLog()
            {
                ClientStockReportId = clientStockReportForTheDay2.Id,
                CardIssuanceId = issuanceJob.Id,
                IssuanceQty = entity.QuantityBad,
                OpeningStock = updateVault.OpeningStock,
                ClosingStock = updateVault.OpeningStock - entity.QuantityBad
            };

            await CreateClientStockLog(newClientStockLog);

            // Update StockReport
            var updateDayStock = clientStockReportForTheDay2;
            updateDayStock.FileName = job.JobName;
            updateDayStock.TotalQtyIssued += entity.QuantityBad;
            updateDayStock.OpeningStock = updateVault.OpeningStock;
            updateDayStock.ClosingStock = updateVault.OpeningStock - entity.QuantityBad;
            updateDayStock.WasteQty += entity.QuantityBad;
            updateDayStock.CreatedOn = DateTime.Now;
            await UpdateClientStockReport(updateDayStock.Id, updateDayStock);

            #endregion

            return Ok();
        }


        [Route("heldcard-receipt/create")]
        public async Task<IHttpActionResult> CreateJobSlitCEAnalysis(CardHeldAnalysis entity)
        {
            UserId = User.Identity.GetUserId();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var cardHeldAnalysis = await context.CardHeldAnalysis.FindAsync(entity.Id);
            var jobSplitCEAnalysis = await context.JobSplitCEAnalysis.Include(a => a.JobSplit).FirstOrDefaultAsync(b => b.Id == cardHeldAnalysis.JobSplitCEAnalysisId);
            var jobTracker = await context.JobTrackers.FindAsync(jobSplitCEAnalysis.JobTrackerId);
            var job = await context.Jobs.FindAsync(jobTracker.JobId);
            var jobVariant = _repo.FindJobVariantByJobId(jobTracker.JobId, jobTracker.Id);
            var clientVaultReport = _repo.FindClientVaultReportBySidProductId(jobVariant.SidProductId);
            var clientStockReportForTheDay = _repo.FindClientStocktReportForTheDay(jobVariant.SidProductId, job.JobName);
            var issuanceJob = _repo.FindCardIssuanceByJobId(job.Id);
            var issuanceTypePartial = _repo.FindIssuanceTypeByName("Partial Issuance");
            var quantityRemaining = 0;
            
            if (clientStockReportForTheDay == null)
            {
                var newClientStockReport = new ClientStockReport()
                {
                    SidProductId = jobVariant.SidProductId,
                    ClientVaultReportId = clientVaultReport.Id,
                    FileName = job.JobName,
                    QtyIssued = 0,
                    WasteQty = 0,
                    ReturnQty = cardHeldAnalysis.QuantityHeld,
                    OpeningStock = clientVaultReport.OpeningStock,
                    ClosingStock = clientVaultReport.OpeningStock + cardHeldAnalysis.QuantityHeld,
                    CreatedOn = DateTime.Now
                };
                await CreateClientStockReport(newClientStockReport);
            }

            var lastStockReport = _repository.ClientStockReports.OrderByDescending(x => x.Id).Take(1).ToList();

            // Update MIS
            // Partial Issuance
            #region GeneralIssuanceRegion

            // Update CardIssuance
            var updateCardIssuance = issuanceJob;
            updateCardIssuance.TotalHeld += entity.QuantityHeld;
            await UpdateCardIssuance(updateCardIssuance.Id, updateCardIssuance);

            //Todo: Create CardIssuanceLog
            var newCardIssuanceLog = new CardIssuanceLog()
            {
                JobTrackerId = jobTracker.Id,
                CardIssuanceId = issuanceJob.Id,
                IssuanceTypeId = issuanceTypePartial.Id,
                TotalQuantity = job.Quantity,
                QuantityIssued = -(entity.QuantityHeld),
                QuantityRemain = issuanceJob.TotalQuantityRemain,
                IssuanceId = userId,
                CollectorId = userId,
                IssuedDate = DateTime.Now
            };
            var t4 = await CreateCardIssuanceLog(newCardIssuanceLog);


            // Update SplitAnalysis
            var splitCEAnalysis = jobSplitCEAnalysis;
            //splitCEAnalysis.QuantityGood -= cardHeldAnalysis.QuantityHeld;
            splitCEAnalysis.HeldReturned += cardHeldAnalysis.QuantityHeld;
            splitCEAnalysis.QuantityHeld = 0;
            splitCEAnalysis.ConfirmedHeld = 0;
            await UpdateJobSplitCEAnalysis(splitCEAnalysis.Id, splitCEAnalysis);

            // Update CardHeldAnalysis
            var updatecardHeldAnalysis = cardHeldAnalysis;
            updatecardHeldAnalysis.IsCardCollected = true;
            await UpdateCardHeldAnalysis(updatecardHeldAnalysis.Id, updatecardHeldAnalysis);

            // Stock Log
            //============
            // Update the Vault and StockReport
            var updateVault = clientVaultReport;
            updateVault.OpeningStock = updateVault.ClosingStock;
            updateVault.ClosingStock += cardHeldAnalysis.QuantityHeld;
            await UpdateClientVaultReport(updateVault.Id, updateVault);

            var newClientStockLog = new ClientStockLog()
            {
                ClientStockReportId = lastStockReport[0].Id,
                CardIssuanceId = issuanceJob.Id,
                IssuanceQty = -(entity.QuantityHeld),
                OpeningStock = updateVault.OpeningStock,
                ClosingStock = updateVault.OpeningStock + entity.QuantityHeld
            };

            var newClientReturnLog = new ClientReturnLog()
            {
                ClientStockReportId = lastStockReport[0].Id,
                IssuanceQty = cardHeldAnalysis.QuantityHeld,
                OpeningStock = updateVault.OpeningStock,
                ClosingStock = updateVault.OpeningStock + cardHeldAnalysis.QuantityHeld
            };

            await CreateClientReturnLog(newClientReturnLog);

            var updateDayStock = lastStockReport[0];
            updateDayStock.FileName = job.JobName;
            //updateDayStock.QtyIssued -= cardHeldAnalysis.QuantityHeld;
            //updateDayStock.TotalQtyIssued -= cardHeldAnalysis.QuantityHeld;
            updateDayStock.OpeningStock = updateVault.OpeningStock;
            updateDayStock.ClosingStock = updateVault.OpeningStock + cardHeldAnalysis.QuantityHeld;
            updateDayStock.ReturnQty += cardHeldAnalysis.QuantityHeld;
            updateDayStock.CreatedOn = DateTime.Now;

            await UpdateClientStockReport(updateDayStock.Id, updateDayStock);
            
            #endregion

            return Ok<JobSplitCEAnalysis>(splitCEAnalysis);
        }

        [Route("heldprint-receipt/create")]
        public async Task<IHttpActionResult> CreateJobSlitPrintCEAnalysis(PrintHeldAnalysis entity)
        {
            UserId = User.Identity.GetUserId();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var printHeldAnalysis = await context.PrintHeldAnalysis.FindAsync(entity.Id);
            var jobSplitPrintCEAnalysis = await context.JobSplitPrintCEAnalysis.Include(a => a.JobSplit).FirstOrDefaultAsync(b => b.Id == printHeldAnalysis.JobSplitPrintCEAnalysisId);
            var jobTracker = await context.JobTrackers.FindAsync(jobSplitPrintCEAnalysis.JobTrackerId);
            var job = await context.Jobs.FindAsync(jobTracker.JobId);
            var jobVariant = _repo.FindJobVariantByJobId(jobTracker.JobId, jobTracker.Id);
            var clientVaultReport = _repo.FindClientVaultReportBySidProductId(jobVariant.SidProductId);
            var clientStockReportForTheDay = _repo.FindClientStocktReportForTheDay(jobVariant.SidProductId, job.JobName);
            var issuanceJob = _repo.FindCardIssuanceByJobId(job.Id);
            var issuanceTypePartial = _repo.FindIssuanceTypeByName("Partial Issuance");
            var quantityRemaining = 0;

            if (clientStockReportForTheDay == null)
            {
                var newClientStockReport = new ClientStockReport()
                {
                    SidProductId = jobVariant.SidProductId,
                    ClientVaultReportId = clientVaultReport.Id,
                    FileName = job.JobName,
                    QtyIssued = 0,
                    WasteQty = 0,
                    ReturnQty = printHeldAnalysis.QuantityHeld,
                    OpeningStock = clientVaultReport.OpeningStock,
                    ClosingStock = clientVaultReport.OpeningStock + printHeldAnalysis.QuantityHeld,
                    CreatedOn = DateTime.Now
                };
                await CreateClientStockReport(newClientStockReport);
            }

            var lastStockReport = _repository.ClientStockReports.OrderByDescending(x => x.Id).Take(1).ToList();

            // Update MIS
            // Partial Issuance
            #region GeneralIssuanceRegion

            // Update CardIssuance
            var updateCardIssuance = issuanceJob;
            updateCardIssuance.TotalHeld += entity.QuantityHeld;
            await UpdateCardIssuance(updateCardIssuance.Id, updateCardIssuance);

            //Todo: Create CardIssuanceLog
            var newCardIssuanceLog = new CardIssuanceLog()
            {
                JobTrackerId = jobTracker.Id,
                CardIssuanceId = issuanceJob.Id,
                IssuanceTypeId = issuanceTypePartial.Id,
                TotalQuantity = job.Quantity,
                QuantityIssued = -(entity.QuantityHeld),
                QuantityRemain = issuanceJob.TotalQuantityRemain,
                IssuanceId = userId,
                CollectorId = userId,
                IssuedDate = DateTime.Now
            };
            var t4 = await CreateCardIssuanceLog(newCardIssuanceLog);


            // Update SplitAnalysis
            var splitPrintCEAnalysis = jobSplitPrintCEAnalysis;
            //splitPrintCEAnalysis.QuantityGood -= printHeldAnalysis.QuantityHeld;
            splitPrintCEAnalysis.HeldReturned += printHeldAnalysis.QuantityHeld;
            splitPrintCEAnalysis.QuantityHeld = 0;
            splitPrintCEAnalysis.ConfirmedHeld = 0;
            await UpdateJobSplitPrintCEAnalysis(splitPrintCEAnalysis.Id, splitPrintCEAnalysis);

            // Update CardHeldAnalysis
            var updatecardHeldAnalysis = printHeldAnalysis;
            updatecardHeldAnalysis.IsCardCollected = true;
            await UpdatePrintHeldAnalysis(updatecardHeldAnalysis.Id, updatecardHeldAnalysis);

            // Stock Log
            //============
            // Update the Vault and StockReport
            var updateVault = clientVaultReport;
            updateVault.OpeningStock = updateVault.ClosingStock;
            updateVault.ClosingStock += printHeldAnalysis.QuantityHeld;
            await UpdateClientVaultReport(updateVault.Id, updateVault);
            
            var newClientStockLog = new ClientStockLog()
            {
                ClientStockReportId = lastStockReport[0].Id,
                CardIssuanceId = issuanceJob.Id,
                IssuanceQty = -(entity.QuantityHeld),
                OpeningStock = updateVault.OpeningStock,
                ClosingStock = updateVault.OpeningStock + entity.QuantityHeld
            };

            var newClientReturnLog = new ClientReturnLog()
            {
                ClientStockReportId = lastStockReport[0].Id,
                IssuanceQty = printHeldAnalysis.QuantityHeld,
                OpeningStock = updateVault.OpeningStock,
                ClosingStock = updateVault.OpeningStock + printHeldAnalysis.QuantityHeld
            };

            await CreateClientReturnLog(newClientReturnLog);

            var updateDayStock = lastStockReport[0];
            updateDayStock.FileName = job.JobName;
            //updateDayStock.QtyIssued -= cardHeldAnalysis.QuantityHeld;
            //updateDayStock.TotalQtyIssued -= cardHeldAnalysis.QuantityHeld;
            updateDayStock.OpeningStock = updateVault.OpeningStock;
            updateDayStock.ClosingStock = updateVault.OpeningStock + printHeldAnalysis.QuantityHeld;
            updateDayStock.ReturnQty += printHeldAnalysis.QuantityHeld;
            updateDayStock.CreatedOn = DateTime.Now;

            await UpdateClientStockReport(updateDayStock.Id, updateDayStock);


            #endregion

            return Ok<JobSplitPrintCEAnalysis>(splitPrintCEAnalysis);
        }


        /// <summary>
        /// Dispatch Resources
        /// </summary>
        [HttpPost]
        [Route("DispatchDelivery/create")]
        public async Task<IHttpActionResult> CreateDispatchDelivery(DispatchDeliveryModel entity)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var dispatchModel = new DispatchDelivery()
            {
                SidClientId = entity.SidClientId,
                JobTrackerId = entity.JobTrackerId,
                RangeFrom = entity.RangeFrom,
                RangeTo = entity.RangeTo,
            };

            UserId = User.Identity.GetUserId();

            dispatchModel.CreatedOn = DateTime.Now;
            dispatchModel.CreatedById = UserId;

            context.DispatchDelivery.Add(dispatchModel);
            await context.SaveChangesAsync();

            // Update the MA DeliveryLog
            var cardDeliveryLog = await context.CardDeliveryLogs.FindAsync(entity.CardDeliveryLogId);
            cardDeliveryLog.IsConfirmed = true;
            await UpdateCardDeliveryLog(cardDeliveryLog.Id, cardDeliveryLog);

            //Update CardDelivery
            var cardDelivery = await context.CardDelivery.FindAsync(cardDeliveryLog.CardDeliveryId);
            cardDelivery.TotalQuantity += ((entity.RangeTo - entity.RangeFrom) + 1);
            await UpdateCardDelivery(cardDelivery.Id, cardDelivery);

            // Update JobTracker from WIP to completed
            var jobTracker = await context.JobTrackers.FindAsync(entity.JobTrackerId);
            var job = await context.Jobs.FindAsync(jobTracker.JobId);

           

            // Get Required Resources
            var jobTypePersoOnly = _repo.FindJobTypeByName("Perso Only");
            var jobTypePrintingOnly = _repo.FindJobTypeByName("Printing Only");
            var jobTypeMailingOnly = _repo.FindJobTypeByName("Mailing Only");
            var jobTypeDispatchOnly = _repo.FindJobTypeByName("Dispatch Only");
            var jobTypePrintingAndPerso = _repo.FindJobTypeByName("Printing And Perso");
            var jobTypePrintingPersoAndMailing = _repo.FindJobTypeByName("Printing, Perso And Mailing");
            var jobTypePersoAndMailing = _repo.FindJobTypeByName("Perso And Mailing");

            var jobStatusWIP = _repo.FindJobStatusByName("WIP");
            var jobStatusCompleted = _repo.FindJobStatusByName("Completed");
            var jobStatusQueue = _repo.FindJobStatusByName("Queue");

            var serviceType = job.ServiceTypeId;

            // Todo: Update CardHeld on the cardDelievery Table //! Important
            // var cardIssuance = _repo.FindCardIssuanceByJobId(job.Id);
            var carddeliveryQuantity = cardDelivery.TotalQuantity + cardDelivery.TotalHeld;

            if (carddeliveryQuantity == job.Quantity)
            {

                #region JobTracker

                if (serviceType == jobTypePersoOnly.Id)
                {
                    var updateJobTracker = jobTracker;
                    updateJobTracker.CardEngrResumeId = jobStatusCompleted.Id;
                    updateJobTracker.QCId = jobStatusCompleted.Id;
                    updateJobTracker.DispatchId = jobStatusCompleted.Id;
                    var t1 = await UpdateJobTracker(updateJobTracker.Id, updateJobTracker);
                }
                else if (serviceType == jobTypePrintingOnly.Id)
                {
                    var updateJobTracker = jobTracker;
                    updateJobTracker.PrintQCId = jobStatusCompleted.Id;
                    updateJobTracker.DispatchId = jobStatusCompleted.Id;
                    var t1 = await UpdateJobTracker(updateJobTracker.Id, updateJobTracker);
                }
                else if (serviceType == jobTypeMailingOnly.Id)
                {
                    var updateJobTracker = jobTracker;
                    updateJobTracker.MailingId = jobStatusCompleted.Id;
                    updateJobTracker.DispatchId = jobStatusCompleted.Id;
                    var t1 = await UpdateJobTracker(updateJobTracker.Id, updateJobTracker);
                }
                else if (serviceType == jobTypeDispatchOnly.Id)
                {
                    // No need
                }
                else if (serviceType == jobTypePrintingAndPerso.Id)
                {
                    var updateJobTracker = jobTracker;
                    updateJobTracker.PrintQCId = jobStatusCompleted.Id;
                    updateJobTracker.CardEngrResumeId = jobStatusCompleted.Id;
                    updateJobTracker.QCId = jobStatusCompleted.Id;
                    updateJobTracker.DispatchId = jobStatusCompleted.Id;
                    var t1 = await UpdateJobTracker(updateJobTracker.Id, updateJobTracker);
                }
                else if (serviceType == jobTypePersoAndMailing.Id)
                {
                    var updateJobTracker = jobTracker;
                    updateJobTracker.CardEngrResumeId = jobStatusCompleted.Id;
                    updateJobTracker.QCId = jobStatusCompleted.Id;
                    updateJobTracker.MailingId = jobStatusCompleted.Id;
                    updateJobTracker.DispatchId = jobStatusCompleted.Id;
                    var t1 = await UpdateJobTracker(updateJobTracker.Id, updateJobTracker);
                }
                else if (serviceType == jobTypePrintingPersoAndMailing.Id)
                {
                    var updateJobTracker = jobTracker;
                    updateJobTracker.PrintQCId = jobStatusCompleted.Id;
                    updateJobTracker.CardEngrResumeId = jobStatusCompleted.Id;
                    updateJobTracker.QCId = jobStatusCompleted.Id;
                    updateJobTracker.MailingId = jobStatusCompleted.Id;
                    updateJobTracker.DispatchId = jobStatusCompleted.Id;
                    var t1 = await UpdateJobTracker(updateJobTracker.Id, updateJobTracker);
                }

                #endregion

            }


            return Ok<DispatchDelivery>(dispatchModel);
        }


        [Route("carddeliveryconfirmation/create")]
        public async Task<IHttpActionResult> CreateDispatchs(CardDeliveryLog entity)
        {
            var cardDeliveryLog = await context.CardDeliveryLogs.FindAsync(entity.Id);
            if (cardDeliveryLog == null) throw new ArgumentNullException(nameof(cardDeliveryLog));

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            UserId = User.Identity.GetUserId();

            cardDeliveryLog.IsConfirmed = true;
            cardDeliveryLog.ConfirmedById = UserId;
            cardDeliveryLog.ConfirmedOn = DateTime.Now;
            await UpdateCardDeliveryLog(cardDeliveryLog.Id, cardDeliveryLog);

            //Update CardDelivery
            var cardDelivery = await context.CardDelivery.FindAsync(cardDeliveryLog.CardDeliveryId);
            cardDelivery.TotalQuantity += ((entity.RangeTo + entity.RangeFrom) + 1);
            await UpdateCardDelivery(cardDelivery.Id, cardDelivery);

            return Ok<CardDeliveryLog>(entity);
        }


        [Route("DispatchJobReceipt/create")]
        public async Task<IHttpActionResult> CreateDispatchs(Sid08Dispatch entity)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            UserId = User.Identity.GetUserId();

            entity.ReceivedOn = DateTime.Now;
            entity.ReceivedById = UserId;

            context.Sid08Dispatchs.Add(entity);
            await context.SaveChangesAsync();

            return Ok<Sid08Dispatch>(entity);
        }

        [Route("GenerateDeliveryNote/create")]
        public async Task<IHttpActionResult> GenerateDeliveryNotes(IList<DeliveryNoteLogModel> entity)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            UserId = User.Identity.GetUserId();
            
            // Use this to get the clientInformation
            var trackerFirst = await context.JobTrackers.FindAsync(entity[0].JobTrackerId);
            var job = await context.Jobs.FindAsync(trackerFirst.JobId);
            var client = await context.SidClients.FindAsync(entity[0].SidClientId);
            
            var jobTypePersoOnly = _repo.FindJobTypeByName("Perso Only");
            var jobTypePrintingOnly = _repo.FindJobTypeByName("Printing Only");
            var jobTypeMailingOnly = _repo.FindJobTypeByName("Mailing Only");
            var jobTypePrintingAndPerso = _repo.FindJobTypeByName("Printing And Perso");
            var jobTypePrintingPersoAndMailing = _repo.FindJobTypeByName("Printing, Perso And Mailing");
            var jobTypePersoAndMailing = _repo.FindJobTypeByName("Perso And Mailing");
            var jobTypeDispatchOnly = _repo.FindJobTypeByName("Dispatch Only");


            #region CreateDeliveryNoteAndLogs

            // Create the DeleveryNote
            var newEntity = new DeliveryNote()
            {
                CreatedById = UserId,
                TransactionDate = DateTime.Now,
                SidClientId = job.SidClientId,
                DeliveryProfileId = entity[0].DeliveryProfileId,
                HasTemplate = entity[0].HasTemplate,
                Description = entity[0].Description
            };

            context.DeliveryNotes.Add(newEntity);
            await context.SaveChangesAsync();

            // get the last record
            var lastDeliveryNote = _repository.DeliveryNotes.OrderByDescending(x => x.Id).Take(1).ToList();

            var jobStatusWIP = _repo.FindJobStatusByName("WIP");
            var jobStatusCompleted = _repo.FindJobStatusByName("Completed");
            var jobStatusQueue = _repo.FindJobStatusByName("Queue");

         
            // Create the DeliveryNoteLog
            foreach (var item in entity)
            {
                // compute Delivery Details
                var jobTracker = await context.JobTrackers.Include(a => a.Job).FirstOrDefaultAsync(b => b.Id == item.JobTrackerId);
                var dispatchDeliveryNote = await context.DispatchDelivery.FindAsync(item.DispatchDeliveryId);
                var rangeQty = (dispatchDeliveryNote.RangeTo - dispatchDeliveryNote.RangeFrom) + 1;
                var ommited = 0;
                var pending = 0;

                var serviceType = jobTracker.Job.ServiceTypeId;
                
                // Check the JobType
                // For Dispatch Only
                //Todo: Use the JobId for the deliveryNoteQuantity
                var previousDelivery = _repo.FindNoteGeneratedDispatchDeliveryByTrackerId(dispatchDeliveryNote.JobTrackerId);
                var previousDeliveryQty = previousDelivery.Sum(a => ((a.RangeTo - a.RangeFrom) + 1));

                if (serviceType == jobTypeDispatchOnly.Id || serviceType == jobTypeMailingOnly.Id)
                {
                    ommited = 0;
                    pending = 0;
                }
                else if (serviceType == jobTypePrintingOnly.Id) {
                    var jobSPlitPrintCEAnalysis = _repo.FindPrintCEJobAnalysisTrackerId(dispatchDeliveryNote.JobTrackerId);
                    ommited = jobSPlitPrintCEAnalysis.HeldReturned;
                    pending = jobTracker.Job.Quantity - (previousDeliveryQty + ommited);
                }
                else
                {
                    var jobSPlitCEAnalysis = _repo.FindCEJobAnalysisTrackerId(dispatchDeliveryNote.JobTrackerId);
                    ommited = jobSPlitCEAnalysis.HeldReturned;
                    pending = jobTracker.Job.Quantity - (previousDeliveryQty + ommited);
                }

                
                var deliveryNoteLog = new DeliveryNoteLog()
                {
                    QuantityReceived = jobTracker.Job.Quantity,
                    PreviousDelivery = previousDeliveryQty,
                    QuantityDelivered = rangeQty,
                    Ommitted = ommited,
                    Pending = pending,
                    IsPartial = false,
                    DeliveryNoteId = lastDeliveryNote[0].Id,
                    DispatchDeliveryId = item.DispatchDeliveryId,
                    JobTrackerId = item.JobTrackerId,
                };

                context.DeliveryNoteLogs.Add(deliveryNoteLog);
                await context.SaveChangesAsync();

                // Update the DispatchDelivery isGenerated = true;
                var dispatchDelivery = await context.DispatchDelivery.FindAsync(item.DispatchDeliveryId);
                var dispatch = dispatchDelivery;
                dispatch.IsNoteGenerated = true;

                context.Entry(dispatch).State = EntityState.Modified;
                await context.SaveChangesAsync();

                //Check if the JobDelivery is completed
                var totalDelivery = rangeQty + previousDeliveryQty + ommited;

                //// Update JobTracker
                var jobTrackerUpdate = await context.JobTrackers.FindAsync(item.JobTrackerId);

                if (jobTracker.Job.Quantity == totalDelivery)
                {
                    jobTrackerUpdate.DispatchId = jobStatusCompleted.Id;
                }
                else
                {
                    jobTrackerUpdate.DispatchId = jobStatusWIP.Id;
                }
                
                jobTrackerUpdate.CustomerServiceId = jobStatusQueue.Id;
                jobTrackerUpdate.MAudId = jobStatusQueue.Id;
                var t1 = await UpdateJobTracker(jobTrackerUpdate.Id, jobTrackerUpdate);
                
            }
            
            #endregion

            return Ok<IList<DeliveryNoteLogModel>>(entity);
        }

        [Route("GenerateWasteNote/create")]
        public async Task<IHttpActionResult> GenerateWasteNotes(IList<DeliveryWasteLogModel> entity)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            UserId = User.Identity.GetUserId();

            #region CreateDeliveryNoteAndLogs
            
            // Create the DeliveryNoteLog
            foreach (var x in entity)
            {
                var wasteAnalysis = await context.CardWasteAnalysis.FindAsync(x.CardWasteAnalysisId);
                var tracker = await context.JobTrackers.FindAsync(x.JobTrackerId);
                var job = await context.Jobs.FindAsync(tracker.JobId);

                var wasteDeliveryNote = new WasteDeliveryNote()
                {
                    CreatedById = UserId,
                    SidClientId = job.SidClientId,
                    DeliveryProfileId = entity[0].DeliveryProfileId,
                    HasTemplate = entity[0].HasTemplate,
                    Description = entity[0].Description,
                    TransactionDate = DateTime.Now,
                };

                context.WasteDeliveryNotes.Add(wasteDeliveryNote);

                // Create WasteLog
                var wasteDeliveryNoteLog = new WasteDeliveryNoteLog()
                {
                    CardWasteAnalysisId = x.CardWasteAnalysisId,
                    AuditStatus = false,
                    CustomerServiceStatus = false,
                    WasteDeliveryNoteId = wasteDeliveryNote.Id
                };

                context.WasteDeliveryNoteLogs.Add(wasteDeliveryNoteLog);

                //Update the WasteAnalysis
                wasteAnalysis.IsWasteDispatch = true;

                context.CardWasteAnalysis.Attach(wasteAnalysis);
                context.Entry(wasteAnalysis).State = EntityState.Modified;
                //await context.SaveChangesAsync();

            }

            await context.SaveChangesAsync();

            #endregion

            return Ok<IList<DeliveryWasteLogModel>>(entity);
        }



        /// <summary>
        /// Lookups
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        /// 

        [Route("sidclient/create")]
        public async Task<IHttpActionResult> CreateClient(SidClient entity)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            context.SidClients.Add(entity);
            await context.SaveChangesAsync();

            return Ok<SidClient>(entity);
        }

        [HttpPut]
        [Route("sidclient/update/{id:int}")]
        public async Task<IHttpActionResult> UpdateSidClient(int id, SidClient entity)
        {
            var existingEntity = await context.SidClients.FindAsync(entity.Id);

            if (id != entity.Id) { return BadRequest(ModelState); }
            if (existingEntity != null && context.Entry(existingEntity).State != EntityState.Detached)
            {
                context.Entry(existingEntity).State = EntityState.Detached;
            }

            context.SidClients.Attach(entity);
            context.Entry(entity).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok<SidClient>(entity);
        }


        [Route("sidproduct/create")]
        public async Task<IHttpActionResult> CreateClientProduct(SidProduct entity)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            context.SidProducts.Add(entity);
            await context.SaveChangesAsync();

            return Ok<SidProduct>(entity);
        }

        [Route("product-service/create")]
        public async Task<IHttpActionResult> CreateProductService(ProductService entity)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            context.ProductServices.Add(entity);
            await context.SaveChangesAsync();

            return Ok<ProductService>(entity);
        }

        [HttpPut]
        [Route("sidproduct/update/{id:int}")]
        public async Task<IHttpActionResult> UpdateSidProduct(int id, SidProduct entity)
        {
            var existingEntity = await context.SidProducts.FindAsync(entity.Id);

            if (id != entity.Id) { return BadRequest(ModelState); }
            if (existingEntity != null && context.Entry(existingEntity).State != EntityState.Detached)
            {
                context.Entry(existingEntity).State = EntityState.Detached;
            }

            context.SidProducts.Attach(entity);
            context.Entry(entity).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok<SidProduct>(entity);
        }

        // CardIssuance
        public async Task<IHttpActionResult> CreateCardIssuance(CardIssuance entity)
        {
            var userId = User.Identity.GetUserId();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            context.CardIssuances.Add(entity);
            await context.SaveChangesAsync();

            return Ok<CardIssuance>(entity);
        }

        public async Task<IHttpActionResult> UpdateCardIssuance(int id, CardIssuance entity)
        {
            var existingEntity = await context.CardIssuances.FindAsync(entity.Id);

            if (id != entity.Id) { return BadRequest(ModelState); }
            if (existingEntity != null && context.Entry(existingEntity).State != EntityState.Detached)
            {
                context.Entry(existingEntity).State = EntityState.Detached;
            }

            context.CardIssuances.Attach(entity);
            context.Entry(entity).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok<CardIssuance>(entity);
        }

        public async Task<IHttpActionResult> CreateCardIssuanceLog(CardIssuanceLog entity)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            context.CardIssuanceLogs.Add(entity);
            await context.SaveChangesAsync();

            return Ok<CardIssuanceLog>(entity);
        }

        public async Task<IHttpActionResult> CreateWasteLog(JobWasteLog entity)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            context.JobWasteLogs.Add(entity);
            await context.SaveChangesAsync();

            return Ok<JobWasteLog>(entity);
        }

        public async Task<IHttpActionResult> CreateJobTracker(JobTracker entity)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            context.JobTrackers.Add(entity);
            await context.SaveChangesAsync();

            return Ok<JobTracker>(entity);
        }

        public async Task<IHttpActionResult> UpdateJobTracker(int id, JobTracker entity)
        {
            var existingEntity = await context.JobTrackers.FindAsync(entity.Id);
            if (id != entity.Id) { return BadRequest(ModelState); }

            if (existingEntity != null && context.Entry(existingEntity).State != EntityState.Detached)
            {
                context.Entry(existingEntity).State = EntityState.Detached;
            }

            var local = context.Set<JobTracker>().Local.FirstOrDefault(f => f.Id == entity.Id);
            if (local != null) { context.Entry(local).State = EntityState.Detached; }

            // ModifiedOn
            entity.ModifiedOn = DateTime.Now;

            context.JobTrackers.Attach(entity);
            context.Entry(entity).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok<JobTracker>(entity);

        }

        public async Task<IHttpActionResult> UpdateJob(int id, Job entity)
        {
            var existingEntity = await context.Jobs.FindAsync(entity.Id);
            if (id != entity.Id) { return BadRequest(ModelState); }

            if (existingEntity != null && context.Entry(existingEntity).State != EntityState.Detached)
            {
                context.Entry(existingEntity).State = EntityState.Detached;
            }

            var local = context.Set<Job>().Local.FirstOrDefault(f => f.Id == entity.Id);
            if (local != null) { context.Entry(local).State = EntityState.Detached; }

            context.Jobs.Attach(entity);
            context.Entry(entity).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok<Job>(entity);

        }

        // MIS Report
        #region MIS Resources

        public async Task<IHttpActionResult> CreateClientStockLog(ClientStockLog entity)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            context.ClientStockLogs.Add(entity);
            await context.SaveChangesAsync();

            return Ok<ClientStockLog>(entity);
        }

        public async Task<IHttpActionResult> CreateClientReturnLog(ClientReturnLog entity)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            context.ClientReturnLogs.Add(entity);
            await context.SaveChangesAsync();

            return Ok<ClientReturnLog>(entity);
        }

        public async Task<IHttpActionResult> CreateClientStockReport(ClientStockReport entity)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            context.ClientStockReports.Add(entity);
            await context.SaveChangesAsync();

            return Ok<ClientStockReport>(entity);
        }

        public async Task<IHttpActionResult> UpdateClientStockReport(int id, ClientStockReport entity)
        {
            var existingEntity = await context.ClientStockReports.FindAsync(entity.Id);

            if (id != entity.Id) { return BadRequest(ModelState); }

            if (existingEntity != null && context.Entry(existingEntity).State != EntityState.Detached)
            {
                context.Entry(existingEntity).State = EntityState.Detached;
            }

            var local = context.Set<ClientStockReport>().Local.FirstOrDefault(f => f.Id == entity.Id);
            if (local != null) { context.Entry(local).State = EntityState.Detached; }

            context.ClientStockReports.Attach(entity);
            context.Entry(entity).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok<ClientStockReport>(entity);

        }

        [Route("ClientVault/create")]
        public async Task<IHttpActionResult> CreateClientVaultReport(ClientVaultReport entity)
        {
            var existingEntity = await context.ClientVaultReports.FindAsync(entity.Id);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (existingEntity != null)
            {
                var message = string.Format("Product Vault alreay Exist");
                var err = new HttpError(message);
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, err));
            }

            entity.ModifiedOn = DateTime.Now;
            context.ClientVaultReports.Add(entity);
            await context.SaveChangesAsync();

            return Ok<ClientVaultReport>(entity);
        }
        public async Task<IHttpActionResult> UpdateClientVaultReport(int id, ClientVaultReport entity)
        {
            var existingEntity = await context.ClientVaultReports.FindAsync(entity.Id);

            if (id != entity.Id) { return BadRequest(ModelState); }

            if (existingEntity != null && context.Entry(existingEntity).State != EntityState.Detached)
            {
                context.Entry(existingEntity).State = EntityState.Detached;
            }

            var local = context.Set<ClientVaultReport>().Local.FirstOrDefault(f => f.Id == entity.Id);
            if (local != null) { context.Entry(local).State = EntityState.Detached; }

            entity.ModifiedOn = DateTime.Now;
            context.ClientVaultReports.Attach(entity);
            context.Entry(entity).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok<ClientVaultReport>(entity);

        }


        [HttpPut]
        [Route("jobslit-analysis/update/{id:int}")]
        public async Task<IHttpActionResult> UpdateJobSplitCEAnalysis(int id, JobSplitCEAnalysis entity)
        {
            var userId = User.Identity.GetUserId();
            var existingEntity = await context.JobSplitCEAnalysis.FindAsync(entity.Id);
            var jobSplit = await context.JobSplits.FindAsync(entity.JobSplitId);

            if (id != entity.Id) { return BadRequest(ModelState); }

            if (existingEntity != null && context.Entry(existingEntity).State != EntityState.Detached)
            {
                context.Entry(existingEntity).State = EntityState.Detached;
            }

            var local = context.Set<JobSplitCEAnalysis>().Local.FirstOrDefault(f => f.Id == entity.Id);
            if (local != null) { context.Entry(local).State = EntityState.Detached; }

            // Analysis Computation
            var range = (jobSplit.RangeTo - jobSplit.RangeFrom) + 1;
            //var quantityGood = range - (entity.QuantityBad + entity.QuantityHeld);

            entity.QuantityGood = entity.QuantityGood;
            entity.CreatedById = userId;
            entity.CreatedOn = DateTime.Now;

            context.JobSplitCEAnalysis.Attach(entity);
            context.Entry(entity).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok<JobSplitCEAnalysis>(entity);

        }

        [HttpPut]
        [Route("jobslit-print-analysis/update/{id:int}")]
        public async Task<IHttpActionResult> UpdateJobSplitPrintCEAnalysis(int id, JobSplitPrintCEAnalysis entity)
        {
            var userId = User.Identity.GetUserId();
            var existingEntity = await context.JobSplitPrintCEAnalysis.FindAsync(entity.Id);
            var jobSplit = await context.JobSplits.FindAsync(entity.JobSplitId);

            if (id != entity.Id) { return BadRequest(ModelState); }

            if (existingEntity != null && context.Entry(existingEntity).State != EntityState.Detached)
            {
                context.Entry(existingEntity).State = EntityState.Detached;
            }

            var local = context.Set<JobSplitPrintCEAnalysis>().Local.FirstOrDefault(f => f.Id == entity.Id);
            if (local != null) { context.Entry(local).State = EntityState.Detached; }

            // Analysis Computation
            var range = (jobSplit.RangeTo - jobSplit.RangeFrom) + 1;
            //var quantityGood = range - (entity.QuantityBad + entity.QuantityHeld);

            entity.QuantityGood = entity.QuantityGood;
            entity.CreatedById = userId;
            entity.CreatedOn = DateTime.Now;

            context.JobSplitPrintCEAnalysis.Attach(entity);
            context.Entry(entity).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok<JobSplitPrintCEAnalysis>(entity);

        }

        #endregion

        [HttpPut]
        public async Task<IHttpActionResult> UpdateDispatchDelivery(int id, DispatchDelivery entity)
        {
            var existingEntity = await context.DispatchDelivery.FindAsync(entity.Id);

            if (id != entity.Id) { return BadRequest(ModelState); }

            if (existingEntity != null && context.Entry(existingEntity).State != EntityState.Detached)
            {
                context.Entry(existingEntity).State = EntityState.Detached;
            }

            var local = context.Set<DispatchDelivery>().Local.FirstOrDefault(f => f.Id == entity.Id);
            if (local != null) { context.Entry(local).State = EntityState.Detached; }

            context.DispatchDelivery.Attach(entity);
            context.Entry(entity).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok<DispatchDelivery>(entity);

        }

        /// <summary>
        /// CardDelivery
        /// </summary>
        public async Task<IHttpActionResult> UpdateCardDelivery(int id, CardDelivery entity)
        {
            var existingEntity = await context.CardDelivery.FindAsync(entity.Id);

            if (id != entity.Id) { return BadRequest(ModelState); }

            if (existingEntity != null && context.Entry(existingEntity).State != EntityState.Detached)
            {
                context.Entry(existingEntity).State = EntityState.Detached;
            }

            var local = context.Set<CardDelivery>().Local.FirstOrDefault(f => f.Id == entity.Id);
            if (local != null) { context.Entry(local).State = EntityState.Detached; }

            context.CardDelivery.Attach(entity);
            context.Entry(entity).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok<CardDelivery>(entity);

        }

        public async Task<IHttpActionResult> UpdateCardDeliveryLog(int id, CardDeliveryLog entity)
        {
            var existingEntity = await context.CardDeliveryLogs.FindAsync(entity.Id);

            if (id != entity.Id) { return BadRequest(ModelState); }

            if (existingEntity != null && context.Entry(existingEntity).State != EntityState.Detached)
            {
                context.Entry(existingEntity).State = EntityState.Detached;
            }

            var local = context.Set<CardDeliveryLog>().Local.FirstOrDefault(f => f.Id == entity.Id);
            if (local != null) { context.Entry(local).State = EntityState.Detached; }

            context.CardDeliveryLogs.Attach(entity);
            context.Entry(entity).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok<CardDeliveryLog>(entity);

        }

        public async Task<IHttpActionResult> UpdateCardWasteAnalysis(int id, CardWasteAnalysis entity)
        {
            var existingEntity = await context.CardWasteAnalysis.FindAsync(entity.Id);
            if (id != entity.Id) { return BadRequest(ModelState); }

            if (existingEntity != null && context.Entry(existingEntity).State != EntityState.Detached)
            {
                context.Entry(existingEntity).State = EntityState.Detached;
            }

            var local = context.Set<CardWasteAnalysis>().Local.FirstOrDefault(f => f.Id == entity.Id);
            if (local != null) { context.Entry(local).State = EntityState.Detached; }

            context.CardWasteAnalysis.Attach(entity);
            context.Entry(entity).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok<CardWasteAnalysis>(entity);

        }

        public async Task<IHttpActionResult> UpdatePrintWasteAnalysis(int id, PrintWasteAnalysis entity)
        {
            var existingEntity = await context.PrintWasteAnalysis.FindAsync(entity.Id);
            if (id != entity.Id) { return BadRequest(ModelState); }

            if (existingEntity != null && context.Entry(existingEntity).State != EntityState.Detached)
            {
                context.Entry(existingEntity).State = EntityState.Detached;
            }

            var local = context.Set<PrintWasteAnalysis>().Local.FirstOrDefault(f => f.Id == entity.Id);
            if (local != null) { context.Entry(local).State = EntityState.Detached; }

            context.PrintWasteAnalysis.Attach(entity);
            context.Entry(entity).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok<PrintWasteAnalysis>(entity);

        }

        public async Task<IHttpActionResult> UpdateCardHeldAnalysis(int id, CardHeldAnalysis entity)
        {
            var existingEntity = await context.CardHeldAnalysis.FindAsync(entity.Id);

            if (id != entity.Id) { return BadRequest(ModelState); }

            if (existingEntity != null && context.Entry(existingEntity).State != EntityState.Detached)
            {
                context.Entry(existingEntity).State = EntityState.Detached;
            }

            var local = context.Set<CardHeldAnalysis>().Local.FirstOrDefault(f => f.Id == entity.Id);
            if (local != null) { context.Entry(local).State = EntityState.Detached; }

            context.CardHeldAnalysis.Attach(entity);
            context.Entry(entity).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok<CardHeldAnalysis>(entity);

        }

        public async Task<IHttpActionResult> UpdatePrintHeldAnalysis(int id, PrintHeldAnalysis entity)
        {
            var existingEntity = await context.PrintHeldAnalysis.FindAsync(entity.Id);

            if (id != entity.Id) { return BadRequest(ModelState); }

            if (existingEntity != null && context.Entry(existingEntity).State != EntityState.Detached)
            {
                context.Entry(existingEntity).State = EntityState.Detached;
            }

            var local = context.Set<PrintHeldAnalysis>().Local.FirstOrDefault(f => f.Id == entity.Id);
            if (local != null) { context.Entry(local).State = EntityState.Detached; }

            context.PrintHeldAnalysis.Attach(entity);
            context.Entry(entity).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok<PrintHeldAnalysis>(entity);

        }

        public async Task<IHttpActionResult> CreateCardDelivery(CardDelivery entity)
        {
            userId = User.Identity.GetUserId();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var newEntity = entity; // Entry passage

            context.CardDelivery.Add(newEntity);
            await context.SaveChangesAsync();

            return Ok<CardDelivery>(newEntity);
        }
        
        

        #region ResetResources

        public async Task<IHttpActionResult> UpdateServerJobQueue(int id, ServerJobQueue entity)
        {
            User.Identity?.GetUserId();
            var existingEntity = await context.ServerJobQueues.FindAsync(entity.Id);

            if (id != entity.Id)
            {
                return BadRequest(ModelState);
            }

            if (existingEntity != null && context.Entry(existingEntity).State != EntityState.Detached)
            {
                context.Entry(existingEntity).State = EntityState.Detached;
            }

            var local = context.Set<JobTracker>().Local.FirstOrDefault(f => f.Id == entity.Id);
            if (local != null) { context.Entry(local).State = EntityState.Detached; }

            context.ServerJobQueues.Attach(entity);
            context.Entry(entity).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return Ok<ServerJobQueue>(entity);

        }

        #endregion



        [Route("reset/create")]
        public async Task<IHttpActionResult> CreateReset(EmbedCardRequest entity)
        {
            if (entity == null) throw new ArgumentNullException(nameof(entity));
            UserId = User.Identity.GetUserId();

            // Server Job Reset
            #region ServerJobQueues

            var serverJobs = _repository.ServerJobQueues;

            foreach (var serverJob in serverJobs)
            {
                serverJob.IsTreated = false;
                serverJob.IsDeleted = false;
                await UpdateServerJobQueue(serverJob.Id, serverJob);
            }

            var termsList = new List<string>
            {
                "Sid01CardOps",
                "Sid03FirstCard",
                "Sid04Printing",
                "Sid05QA",
                "Sid06QC",
                "Sid07Mailing",
                "Sid09CustomerService",
                "ClientReturnLog",
                "ClientStockLog",
                "JobSplitQCAnalysis",
                "CardDeliveryLog",
            };

            foreach (var m in termsList)
            {
                context.Database.ExecuteSqlCommand("TRUNCATE TABLE [" + m + "]");
            }

            #endregion

            return Ok("Reset Completed");
        }


        [Route("product/create")]
        public async Task<IHttpActionResult> CreateProduct(SidProduct entity)
        {

            var sidProduct = _repo.FindClientProductByName(entity.Name);

            if (sidProduct != null)
            {
                var message = string.Format("Product already Exist");
                var err = new HttpError(message);
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, err));

            }
            
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            context.SidProducts.Add(entity);
            await context.SaveChangesAsync();

            return Ok<SidProduct>(entity);
        }




        /// Revert Section
        /// 
        /// 1. Dipatche Level
        ///    Delete all CardDelevery base on 









    }
}
