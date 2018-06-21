using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace AuthorizationServer.Api.Controllers
{
    public class Test02Controller : ApiController
    {
        [Route("new/cardissuance/create")]
        public async Task<IHttpActionResult> CreateNewCardIssuance(CardIssuanceModel entity)
        {
            string userId = User.Identity.GetUserId();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            #region Definations

            var job = await context.Jobs.FindAsync(entity.JobId);

            // ClientStockLog
            var issuanceStatusPartial = _repo.FindIssuanceStatusByName("Partial");
            var issuanceStatusCompleted = _repo.FindIssuanceStatusByName("Completed");
            var issuanceTypeNew = _repo.FindIssuanceTypeByName("New Issuance");
            var issuanceJob = _repo.FindCardIssuanceByJobTrackerId(entity.JobTrackerId);

            //var jobTrackerJobId = _repo.FindJobTrackerByJobId(entity.JobId);
            var jobTracker = await context.JobTrackers.FindAsync(entity.JobTrackerId);
            var jobStatusPartial = _repo.FindJobStatusByName("Partial");
            var jobStatusComplete = _repo.FindJobStatusByName("Completed");

            var jobTrackerStatusCompleted = _repo.FindJobTrackerStatusByName("Completed");
            var jobTrackerStatusPartial = _repo.FindJobTrackerStatusByName("Partial");
            var jobTrackerStatusWIP = _repo.FindJobTrackerStatusByName("WIP");

            // MIS Requirements
            var jobVariant = _repo.FindJobVariantByJobId(job.Id);
            var clientVaultReport = _repo.FindClientVaultReportBySidProductId(jobVariant.SidProductId);
            //var clientStockReport = _repo.FindClientStocktReportBySidProductId(jobVariant.SidProductId);

            var clientStockReportForTheDay = _repo.FindClientStocktReportForTheDay(jobVariant.SidProductId);
            // ClientStockReportFortheDay

            #endregion

            #region Validator

            if (entity.TotalQuantity > job.Quantity)
            {
                return BadRequest(ModelState);
            }

            // Todo
            if (clientVaultReport == null || clientVaultReport.OpeningStock < entity.TotalQuantityIssued)
            {
                return BadRequest(ModelState);
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
                if (issuanceJob == null)
                {
                    // get a new one
                    var clientStockReportForTheDay2 = _repo.FindClientStocktReportForTheDay(jobVariant.SidProductId);

                    // Issueance Section
                    //==================
                    if (job.Quantity == entity.TotalQuantityIssued)
                    {
                        // Complete Issuance
                        #region GeneralIssuanceRegion

                        // Create CardIssuance
                        var newCardIssuance = new CardIssuance()
                        {
                            JobTrackerId = entity.JobTrackerId,
                            JobId = entity.JobId,
                            IssuanceId = userId, //entity.IssuanceId,
                            IssuanceStatusId = issuanceStatusCompleted.Id,
                            CollectorId = entity.CollectorId,
                            TotalQuantity = job.Quantity,
                            TotalQuantityIssued = entity.TotalQuantityIssued,
                            TotalQuantityRemain = entity.TotalQuantityRemain //todo: should not be from client
                        };
                        var t3 = await CreateCardIssuance(newCardIssuance);

                        var lastIssuance = _repository.CardIssuances.Where(i => i.JobId == job.Id).OrderByDescending(x => x.Id).Take(1).ToList();

                        var newCardIssuanceLog = new CardIssuanceLog()
                        {
                            CardIssuanceId = lastIssuance[0].Id,
                            IssuanceTypeId = issuanceTypeNew.Id,
                            TotalQuantity = lastIssuance[0].TotalQuantity,
                            QuantityIssued = lastIssuance[0].TotalQuantityIssued,
                            QuantityRemain = lastIssuance[0].TotalQuantityRemain,
                            IssuanceId = userId,
                            CollectorId = entity.CollectorId,
                            IssuedDate = DateTime.Now
                        };
                        var t4 = await CreateCardIssuanceLog(newCardIssuanceLog);

                        var lastIssuanceLog = _repository.CardIssuanceLogs.OrderByDescending(x => x.Id).Take(1).ToList();

                        var newJobBatchTracker = new JobBatchTracker()
                        {
                            JobId = job.Id,
                            JobTrackerId = jobTracker.Id,
                            CardIssuanceId = lastIssuance[0].Id,
                            JobTrackerStatusId = jobTrackerStatusWIP.Id
                        };
                        var t2 = await CreateJobBatchTracker(newJobBatchTracker);

                        // Stock Log
                        //============
                        // Check for today ClientStockReport
                        // Update the Vault and StockReport

                        ClientVaultReport updateVault = clientVaultReport;
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

                        var t2StockLog = await CreateClientStockLog(newClientStockLog);

                        ClientStockReport updateDayStock = clientStockReportForTheDay2;
                        updateDayStock.FileName = job.JobName;
                        updateDayStock.QtyIssued = entity.TotalQuantityIssued;
                        updateDayStock.OpeningStock = updateVault.OpeningStock;
                        updateDayStock.ClosingStock = updateVault.OpeningStock - entity.TotalQuantityIssued;
                        updateDayStock.CreatedOn = DateTime.Now;

                        var t1ClientStock = await UpdateClientStockReport(updateDayStock.Id, updateDayStock);


                        #endregion

                        // Update IsJobPartial Status
                        Job updateJob = job;
                        updateJob.IsJobPartial = false;
                        var tUpdateJob = await UpdateJob(updateJob.Id, updateJob);

                        // Update JobTracker
                        JobTracker updateJobTracker = jobTracker;
                        updateJobTracker.InventoryId = jobStatusComplete.Id;
                        updateJobTracker.JobTrackerStatusId = jobTrackerStatusWIP.Id;
                        var tUpdateJobTracker = await UpdateJobTracker(updateJobTracker.Id, updateJobTracker);

                    }
                    else
                    {
                        // Partial Issuance
                        #region GeneralIssuanceRegion

                        // Create CardIssuance
                        var newCardIssuance = new CardIssuance()
                        {
                            JobTrackerId = entity.JobTrackerId,
                            JobId = entity.JobId,
                            IssuanceId = userId, //entity.IssuanceId,
                            IssuanceStatusId = issuanceStatusCompleted.Id,
                            CollectorId = entity.CollectorId,
                            TotalQuantity = job.Quantity,
                            TotalQuantityIssued = entity.TotalQuantityIssued,
                            TotalQuantityRemain = entity.TotalQuantityRemain //todo: should not be from client
                        };
                        var t3 = await CreateCardIssuance(newCardIssuance);

                        var lastIssuance = _repository.CardIssuances.Where(i => i.JobId == job.Id).OrderByDescending(x => x.Id).Take(1).ToList();

                        var newCardIssuanceLog = new CardIssuanceLog()
                        {
                            CardIssuanceId = lastIssuance[0].Id,
                            IssuanceTypeId = issuanceTypeNew.Id,
                            TotalQuantity = lastIssuance[0].TotalQuantity,
                            QuantityIssued = lastIssuance[0].TotalQuantityIssued,
                            QuantityRemain = lastIssuance[0].TotalQuantityRemain,
                            IssuanceId = userId,
                            CollectorId = entity.CollectorId,
                            IssuedDate = DateTime.Now
                        };
                        var t4 = await CreateCardIssuanceLog(newCardIssuanceLog);

                        var lastIssuanceLog = _repository.CardIssuanceLogs.OrderByDescending(x => x.Id).Take(1).ToList();

                        var newJobBatchTracker = new JobBatchTracker()
                        {
                            JobId = job.Id,
                            JobTrackerId = jobTracker.Id,
                            CardIssuanceId = lastIssuance[0].Id,
                            JobTrackerStatusId = jobTrackerStatusWIP.Id
                        };
                        var t2 = await CreateJobBatchTracker(newJobBatchTracker);

                        // Stock Log
                        //============
                        // Check for today ClientStockReport
                        // Update the Vault and StockReport

                        ClientVaultReport updateVault = clientVaultReport;
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

                        var t2StockLog = await CreateClientStockLog(newClientStockLog);

                        ClientStockReport updateDayStock = clientStockReportForTheDay2;
                        updateDayStock.FileName = job.JobName;
                        updateDayStock.QtyIssued = entity.TotalQuantityIssued;
                        updateDayStock.OpeningStock = updateVault.OpeningStock;
                        updateDayStock.ClosingStock = updateVault.OpeningStock - entity.TotalQuantityIssued;
                        updateDayStock.CreatedOn = DateTime.Now;

                        var t1ClientStock = await UpdateClientStockReport(updateDayStock.Id, updateDayStock);


                        #endregion

                        // Update IsJobPartial Status
                        Job updateJob = job;
                        updateJob.IsJobPartial = true;
                        var t0 = await UpdateJob(updateJob.Id, updateJob);

                        // Update JobTracker
                        JobTracker updateJobTracker = jobTracker;
                        updateJobTracker.InventoryId = jobStatusComplete.Id;
                        updateJobTracker.JobTrackerStatusId = jobTrackerStatusWIP.Id;
                        var t1 = await UpdateJobTracker(updateJobTracker.Id, updateJobTracker);

                        // Create CardIssuance
                        entity.IssuanceStatusId = issuanceStatusPartial.Id;
                        entity.TotalQuantityRemain = (job.Quantity - entity.TotalQuantityIssued);

                    }
                }
            }

            #endregion

            return Ok();
        }


    }
}
