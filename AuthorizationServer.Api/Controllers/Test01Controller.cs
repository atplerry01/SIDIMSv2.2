using AuthorizationServer.Api.Infrastructure;
using Microsoft.AspNet.Identity;
using SID.Common.Model.Inventory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace AuthorizationServer.Api.Controllers
{
    [Authorize]
    [RoutePrefix("api/inventoryX")]
    public class Test01Controller : ApiController
    {
        private ApplicationRepository _repo = null;
        readonly SidimBreezeRepository _repository = new SidimBreezeRepository();
        ApplicationDbContext context = new ApplicationDbContext();

        string userId;  //Todo

        [Route("new/cardissuance/create")]
        public async Task<IHttpActionResult> CreateNewCardIssuanceX(CardIssuanceModel entity)
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

            if (entity.TotalQuantity > job.Quantity)
            {
                return BadRequest(ModelState);
            }

            if (job != null)
            {
                if (issuanceJob == null)
                {
                    // ClientVaultReport // ClientStockReport
                    #region InitializedSetup

                    if (clientVaultReport == null)
                    {
                        //create new
                        var newClientValutReport = new ClientVaultReport()
                        {
                            SidProductId = jobVariant.SidProductId,
                            OpeningStock = 0,
                            ClosingStock = 0,
                        };

                        var cvr = await CreateClientVaultReport(newClientValutReport);
                    }

                    if (clientStockReportForTheDay == null)
                    {
                        var clientVaultReport2 = _repo.FindClientVaultReportBySidProductId(jobVariant.SidProductId);

                        //create new
                        var newClientStockReport = new ClientStockReport()
                        {
                            SidProductId = jobVariant.SidProductId,
                            ClientVaultReportId = clientVaultReport2.Id,
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

                    //Todo
                    var clientVaultReport3 = _repo.FindClientVaultReportBySidProductId(jobVariant.SidProductId);

                    // There is enough card in vault
                    if (clientVaultReport3.OpeningStock > job.Quantity)
                    {

                        // Only Issue if ClientValutReport:OpeningStock > Quantity
                        if (job.Quantity == entity.TotalQuantityIssued)
                        {
                            var clientStockReportForTheDay2 = _repo.FindClientStocktReportForTheDay(jobVariant.SidProductId);
                            var clientVaultReport2 = _repo.FindClientVaultReportBySidProductId(jobVariant.SidProductId);

                            #region JobProcessForCompleteIssuance

                            // Update IsJobPartial Status
                            Job updateJob = job;
                            updateJob.IsJobPartial = false;
                            var t0 = await UpdateJob(updateJob.Id, updateJob);
                            //done

                            // Update JobTracker
                            JobTracker updateJobTracker = jobTracker;
                            updateJobTracker.InventoryId = jobStatusComplete.Id;
                            updateJobTracker.JobTrackerStatusId = jobTrackerStatusWIP.Id;
                            var t1 = await UpdateJobTracker(updateJobTracker.Id, updateJobTracker);
                            //done

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
                                TotalQuantityRemain = 0
                            };
                            var t3 = await CreateCardIssuance(newCardIssuance);


                            // Create CardIssuanceLog
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

                            //Todo Where(i => i.CardIssuanceId == lastIssuance[0].Id)
                            //// After all is done
                            //// Create JobBatchTracker
                            var lastIssuanceLog = _repository.CardIssuanceLogs.OrderByDescending(x => x.Id).Take(1).ToList();
                            var newJobBatchTracker = new JobBatchTracker()
                            {
                                JobId = job.Id,
                                JobTrackerId = jobTracker.Id,
                                CardIssuanceId = lastIssuance[0].Id,
                                JobTrackerStatusId = jobTrackerStatusWIP.Id
                            };

                            var t2 = await CreateJobBatchTracker(newJobBatchTracker);
                            
                            #endregion

                            // Create ClientStockReport for the day,
                            // Use it to create the ClientStockLog
                            // Update ClientVaultReport by reducing it

                            #region MISEntryTest

                            // get ClientStockReport for the day, if null create
                            var newClientStockLog = new ClientStockLog()
                            {
                                ClientStockReportId = clientStockReportForTheDay.Id,
                                CardIssuanceId = issuanceJob.Id,
                                IssuanceQty = entity.TotalQuantityIssued,
                                OpeningStock = clientVaultReport.OpeningStock,
                                ClosingStock = clientVaultReport.OpeningStock - entity.TotalQuantityIssued,
                            };

                            var csl = await CreateClientStockLog(newClientStockLog);

                            // Update ClientVaultReport
                            ClientVaultReport updateClientVaultReport = clientVaultReport2;
                            updateClientVaultReport.ClosingStock -= job.Quantity;

                            // Update ClientStockReport
                            ClientStockReport updateClientStockReport = clientStockReportForTheDay2;
                            //updateClientStockReport.FileName = job.JobName;
                            updateClientStockReport.QtyIssued = job.Quantity;
                            updateClientStockReport.ClosingStock -= job.Quantity;

                            #endregion

                            #region MIS Report
                            // get cientVaultReportId

                            if (clientVaultReport == null)
                            {

                                #region clientVaultReportNull

                                // create a new ClientVaultReport and 
                                // Continue with the Process
                                //if (clientStockReport == null)
                                //{

                                //    #region clientStockReportNull

                                //    // Create get the last entry
                                //    // and continue

                                //    //// Create ClientStockLog
                                //    //var newClientStockLog = new ClientStockLog()
                                //    //{
                                //    //    lientStockReportId= 1,
                                //    //    CardIssuanceId = 1,

                                //    //    IssuanceQty = 1,
                                //    //    OpeningStock = 1,
                                //    //    ClosingStock = 1
                                //    //};

                                //    #endregion

                                //}
                                //else
                                //{

                                //    #region clientStockReport

                                //    //// Continue
                                //    //// Create ClientStockLog
                                //    //var newClientStockLog = new ClientStockLog()
                                //    //{

                                //    //};

                                //    #endregion

                                //}


                                #endregion

                            }
                            else
                            {

                                #region ClientVaultReport

                                //// Continue with the Process
                                //if (clientStockReport == null)
                                //{
                                //    #region clientStockReportNull

                                //    // Create get the last entry
                                //    // and continue

                                //    //// Create ClientStockLog
                                //    //var newClientStockLog = new ClientStockLog()
                                //    //{

                                //    //};

                                //    #endregion

                                //    // Create and continue
                                //}
                                //else
                                //{
                                //    // Continue
                                //    #region clientStockReport

                                //    //// Continue
                                //    //// Create ClientStockLog
                                //    //var newClientStockLog = new ClientStockLog()
                                //    //{

                                //    //};

                                //    #endregion

                                //}

                                #endregion

                            }

                            // Create ClientStockReport for the day,
                            // Use it to create the ClientStockLog
                            // Update ClientVaultReport

                            // Create ClientStockLog(DailyReport) 
                            // { get ClientVaultReport,  }



                            // CardStock
                            // Card Stock Log
                            // ClientStock
                            // ClientStockLog

                            #endregion
                        }
                        else
                        {
                            var clientStockReportForTheDay2 = _repo.FindClientStocktReportForTheDay(jobVariant.SidProductId);
                            var clientVaultReport2 = _repo.FindClientVaultReportBySidProductId(jobVariant.SidProductId);

                            #region JobProcessForPartialIssuance

                            // Update IsJobPartial Status
                            Job updateJob = job;
                            updateJob.IsJobPartial = true; //Marker
                            var t0 = await UpdateJob(updateJob.Id, updateJob);

                            // Update JobTracker
                            JobTracker updateJobTracker = jobTracker;
                            updateJobTracker.InventoryId = jobStatusComplete.Id;
                            updateJobTracker.JobTrackerStatusId = jobTrackerStatusWIP.Id;
                            var t1 = await UpdateJobTracker(updateJobTracker.Id, updateJobTracker);


                            // Create CardIssuance
                            entity.IssuanceStatusId = issuanceStatusPartial.Id;
                            entity.TotalQuantityRemain = (job.Quantity - entity.TotalQuantityIssued);

                            var newCardIssuance = new CardIssuance()
                            {
                                JobTrackerId = entity.JobTrackerId,
                                JobId = entity.JobId,
                                IssuanceId = userId, //entity.IssuanceId,
                                IssuanceStatusId = issuanceStatusPartial.Id,
                                CollectorId = entity.CollectorId,
                                TotalQuantity = job.Quantity,
                                TotalQuantityIssued = entity.TotalQuantityIssued,
                                TotalQuantityRemain = entity.TotalQuantityRemain
                            };
                            var t3 = await CreateCardIssuance(newCardIssuance);

                            var lastIssuance = _repository.CardIssuances.Where(i => i.JobId == job.Id).OrderByDescending(x => x.Id).Take(1).ToList();


                            // Create CardIssuanceLog
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

                            //Todo Where(i => i.CardIssuanceId == lastIssuance[0].Id)
                            //// After all is done
                            //// Create JobBatchTracker
                            var lastIssuanceLog = _repository.CardIssuanceLogs.OrderByDescending(x => x.Id).Take(1).ToList();
                            var newJobBatchTracker = new JobBatchTracker()
                            {
                                JobId = job.Id,
                                JobTrackerId = jobTracker.Id,
                                CardIssuanceId = lastIssuance[0].Id,
                                JobTrackerStatusId = jobTrackerStatusWIP.Id
                            };

                            var t2 = await CreateJobBatchTracker(newJobBatchTracker);

                            #endregion


                            #region MISEntryTest

                            // get ClientStockReport for the day, if null create
                            var newClientStockLog = new ClientStockLog()
                            {
                                ClientStockReportId = clientStockReportForTheDay.Id,
                                CardIssuanceId = issuanceJob.Id,
                                IssuanceQty = entity.TotalQuantityIssued,
                                OpeningStock = clientVaultReport.OpeningStock,
                                ClosingStock = clientVaultReport.OpeningStock - entity.TotalQuantityIssued,
                            };

                            var csl = await CreateClientStockLog(newClientStockLog);

                            // Update ClientVaultReport
                            ClientVaultReport updateClientVaultReport = clientVaultReport2;
                            updateClientVaultReport.ClosingStock -= job.Quantity;

                            // Update ClientStockReport
                            ClientStockReport updateClientStockReport = clientStockReportForTheDay2;
                            //updateClientStockReport.FileName = job.JobName;
                            updateClientStockReport.QtyIssued = job.Quantity;
                            updateClientStockReport.ClosingStock -= job.Quantity;

                            #endregion

                        }


                    }

                    #endregion

                }
            }

            return Ok();
        }

        [Route("partialX/cardissuance/create")]
        public async Task<IHttpActionResult> CreatePartialCardIssuanceX(CardIssuance entity)
        {
            userId = User.Identity.GetUserId();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            #region Definations

            var jobTypePersoOnly = _repo.FindJobTypeByName("Perso Only");
            var jobTypePrintingOnly = _repo.FindJobTypeByName("Printing Only");
            var jobTypeMailingOnly = _repo.FindJobTypeByName("Mailing Only");
            var jobTypePrintingAndPerso = _repo.FindJobTypeByName("Printing And Perso");

            var jobStatusPending = _repo.FindJobStatusByName("Pending");
            var jobStatusCompleted = _repo.FindJobStatusByName("Completed");
            var jobStatusQueue = _repo.FindJobStatusByName("Queue");
            var jobStatusNotRequired = _repo.FindJobStatusByName("Not Required");

            var issuanceStatusPartial = _repo.FindIssuanceStatusByName("Partial");
            var issuanceStatusCompleted = _repo.FindIssuanceStatusByName("Completed");
            var issuanceTypePartial = _repo.FindIssuanceTypeByName("Partial Issuance");
            var issuanceJob = _repo.FindCardIssuanceByJobTrackerId(entity.JobTrackerId);
            var job = await context.Jobs.FindAsync(entity.JobId);

            //var jobTrackerJobId = _repo.FindJobTrackerByJobId(entity.JobId);
            var jobTracker = await context.JobTrackers.FindAsync(entity.JobTrackerId);
            var jobStatusPartial = _repo.FindJobStatusByName("Partial");
            var jobStatusComplete = _repo.FindJobStatusByName("Completed");

            var jobTrackerStatusCompleted = _repo.FindJobTrackerStatusByName("Completed");
            var jobTrackerStatusPartial = _repo.FindJobTrackerStatusByName("Partial");
            var jobTrackerStatusWIP = _repo.FindJobTrackerStatusByName("WIP");

            var quantityRemaining = job.Quantity - (issuanceJob.TotalQuantityIssued + entity.TotalQuantityIssued);


            // MIS Requirements
            var jobVariant = _repo.FindJobVariantByJobId(job.Id);
            var clientVaultReport = _repo.FindClientVaultReportBySidProductId(jobVariant.SidProductId);
            //var clientStockReport = _repo.FindClientStocktReportBySidProductId(jobVariant.SidProductId);

            var clientStockReportForTheDay = _repo.FindClientStocktReportForTheDay(jobVariant.SidProductId);
            // ClientStockReportFortheDay


            #endregion


            if (entity.TotalQuantity > job.Quantity)
            {
                return BadRequest(ModelState);
            }

            #region IssuanceRegion

            if (clientVaultReport.OpeningStock > job.Quantity)
            {

                if (issuanceJob.TotalQuantityRemain > 0)
                {
                    var clientStockReportForTheDay2 = _repo.FindClientStocktReportForTheDay(jobVariant.SidProductId);
                    var clientVaultReport2 = _repo.FindClientVaultReportBySidProductId(jobVariant.SidProductId);

                    // Complete Issuance
                    if (job.Quantity == (issuanceJob.TotalQuantityIssued + entity.TotalQuantityIssued))
                    {
                        #region ProcessForCompleteIssuance

                        // Update IsJobPartial Status
                        Job updateJob = job;
                        updateJob.IsJobPartial = false; // For Complete Issuance
                        var t0 = await UpdateJob(updateJob.Id, updateJob);

                        // JobTracker Update


                        // Create a new JobTracker
                        // Update JobTracker

                        #region NewJobTracker

                        //JobTracker newJobTracker = jobTracker;

                        //if (newJobTracker.Job.ServiceTypeId == jobTypePersoOnly.Id)
                        //{
                        //    newJobTracker.InventoryId = jobStatusCompleted.Id;
                        //    newJobTracker.PrintingId = jobStatusNotRequired.Id;
                        //    newJobTracker.CardEngrId = jobStatusQueue.Id;
                        //    newJobTracker.QAId = jobStatusPending.Id;
                        //    newJobTracker.FirstJobRunId = jobStatusQueue.Id;
                        //    newJobTracker.CardEngrResumeId = jobStatusPending.Id;
                        //    newJobTracker.QCId = jobStatusPending.Id;
                        //    newJobTracker.MailingId = jobStatusPending.Id;
                        //    newJobTracker.DispatchId = jobStatusPending.Id;
                        //    newJobTracker.CustomerServiceId = jobStatusPending.Id;
                        //    newJobTracker.JobTrackerStatusId = jobTrackerStatusPartial.Id;
                        //}
                        //else if (newJobTracker.Job.ServiceTypeId == jobTypePrintingOnly.Id)
                        //{
                        //    newJobTracker.InventoryId = jobStatusCompleted.Id;
                        //    newJobTracker.PrintingId = jobStatusQueue.Id;
                        //    newJobTracker.CardEngrId = jobStatusPending.Id;
                        //    newJobTracker.QAId = jobStatusPending.Id;
                        //    newJobTracker.FirstJobRunId = jobStatusPending.Id;
                        //    newJobTracker.CardEngrResumeId = jobStatusPending.Id;
                        //    newJobTracker.QCId = jobStatusPending.Id;
                        //    newJobTracker.MailingId = jobStatusPending.Id;
                        //    newJobTracker.DispatchId = jobStatusPending.Id;
                        //    newJobTracker.CustomerServiceId = jobStatusPending.Id;
                        //    newJobTracker.JobTrackerStatusId = jobTrackerStatusPartial.Id;
                        //}
                        //else if (newJobTracker.Job.ServiceTypeId == jobTypeMailingOnly.Id)
                        //{
                        //    newJobTracker.InventoryId = jobStatusCompleted.Id;
                        //    newJobTracker.PrintingId = jobStatusNotRequired.Id;
                        //    newJobTracker.CardEngrId = jobStatusNotRequired.Id;
                        //    newJobTracker.QAId = jobStatusPending.Id;
                        //    newJobTracker.FirstJobRunId = jobStatusNotRequired.Id;
                        //    newJobTracker.CardEngrResumeId = jobStatusNotRequired.Id;
                        //    newJobTracker.QCId = jobStatusPending.Id;
                        //    newJobTracker.MailingId = jobStatusQueue.Id;
                        //    newJobTracker.DispatchId = jobStatusPending.Id;
                        //    newJobTracker.CustomerServiceId = jobStatusPending.Id;
                        //    newJobTracker.JobTrackerStatusId = jobTrackerStatusPartial.Id;
                        //}
                        //else if (newJobTracker.Job.ServiceTypeId == jobTypePrintingAndPerso.Id)
                        //{
                        //    newJobTracker.InventoryId = jobStatusCompleted.Id;
                        //    newJobTracker.PrintingId = jobStatusQueue.Id;
                        //    newJobTracker.CardEngrId = jobStatusPending.Id;
                        //    newJobTracker.QAId = jobStatusPending.Id;
                        //    newJobTracker.FirstJobRunId = jobStatusPending.Id;
                        //    newJobTracker.CardEngrResumeId = jobStatusPending.Id;
                        //    newJobTracker.QCId = jobStatusPending.Id;
                        //    newJobTracker.MailingId = jobStatusPending.Id;
                        //    newJobTracker.DispatchId = jobStatusPending.Id;
                        //    newJobTracker.CustomerServiceId = jobStatusPending.Id;
                        //    newJobTracker.JobTrackerStatusId = jobTrackerStatusPartial.Id;
                        //}

                        //newJobTracker.InventoryId = jobStatusComplete.Id;
                        //newJobTracker.JobTrackerStatusId = jobTrackerStatusPartial.Id; //Todo
                        //var t1 = await CreateJobTracker(newJobTracker);

                        #endregion

                        // Update CardIssuance
                        issuanceJob.TotalQuantityIssued += entity.TotalQuantityIssued;
                        issuanceJob.TotalQuantityRemain = quantityRemaining;
                        var t33 = UpdateCardIssuance(issuanceJob.Id, issuanceJob);

                        // Create CardIssuanceLog
                        //var lastIssuance = _repository.CardIssuances.Where(i => i.JobId == job.Id).OrderByDescending(x => x.Id).Take(1).ToList();
                        var newCardIssuanceLog = new CardIssuanceLog()
                        {
                            CardIssuanceId = issuanceJob.Id,
                            IssuanceTypeId = issuanceTypePartial.Id, //Todo
                            TotalQuantity = job.Quantity,
                            QuantityIssued = entity.TotalQuantityIssued,
                            QuantityRemain = quantityRemaining,
                            IssuanceId = userId,
                            CollectorId = entity.CollectorId,
                            IssuedDate = DateTime.Now
                        };
                        var t4 = await CreateCardIssuanceLog(newCardIssuanceLog);

                        ////Todo Where(i => i.CardIssuanceId == lastIssuance[0].Id)
                        ////// After all is done
                        ////// Create JobBatchTracker
                        //var lastIssuanceLog = _repository.CardIssuanceLogs.OrderByDescending(x => x.Id).Take(1).ToList();
                        //var newJobBatchTracker = new JobBatchTracker()
                        //{
                        //    JobId = job.Id,
                        //    JobTrackerId = jobTracker.Id,
                        //    CardIssuanceLogId = lastIssuanceLog[0].Id,
                        //    JobTrackerStatusId = jobTrackerStatusWIP.Id
                        //};

                        //var t2 = await CreateJobBatchTracker(newJobBatchTracker);


                        #endregion
                    }
                    else
                    {
                        #region ProcessForInCompleteIssuance

                        // Update IsJobPartial Status
                        Job updateJob = job;
                        updateJob.IsJobPartial = true; // For InComplete Issuance
                        var t0 = await UpdateJob(updateJob.Id, updateJob);

                        // Create a new JobTracker
                        // Update JobTracker

                        #region NewJobTracker

                        //JobTracker newJobTracker = jobTracker;

                        //if (newJobTracker.Job.ServiceTypeId == jobTypePersoOnly.Id)
                        //{
                        //    newJobTracker.InventoryId = jobStatusCompleted.Id;
                        //    newJobTracker.PrintingId = jobStatusNotRequired.Id;
                        //    newJobTracker.CardEngrId = jobStatusQueue.Id;
                        //    newJobTracker.QAId = jobStatusPending.Id;
                        //    newJobTracker.FirstJobRunId = jobStatusQueue.Id;
                        //    newJobTracker.CardEngrResumeId = jobStatusPending.Id;
                        //    newJobTracker.QCId = jobStatusPending.Id;
                        //    newJobTracker.MailingId = jobStatusPending.Id;
                        //    newJobTracker.DispatchId = jobStatusPending.Id;
                        //    newJobTracker.CustomerServiceId = jobStatusPending.Id;
                        //    newJobTracker.JobTrackerStatusId = jobTrackerStatusPartial.Id;
                        //}
                        //else if (newJobTracker.Job.ServiceTypeId == jobTypePrintingOnly.Id)
                        //{
                        //    newJobTracker.InventoryId = jobStatusCompleted.Id;
                        //    newJobTracker.PrintingId = jobStatusQueue.Id;
                        //    newJobTracker.CardEngrId = jobStatusPending.Id;
                        //    newJobTracker.QAId = jobStatusPending.Id;
                        //    newJobTracker.FirstJobRunId = jobStatusPending.Id;
                        //    newJobTracker.CardEngrResumeId = jobStatusPending.Id;
                        //    newJobTracker.QCId = jobStatusPending.Id;
                        //    newJobTracker.MailingId = jobStatusPending.Id;
                        //    newJobTracker.DispatchId = jobStatusPending.Id;
                        //    newJobTracker.CustomerServiceId = jobStatusPending.Id;
                        //    newJobTracker.JobTrackerStatusId = jobTrackerStatusPartial.Id;
                        //}
                        //else if (newJobTracker.Job.ServiceTypeId == jobTypeMailingOnly.Id)
                        //{
                        //    newJobTracker.InventoryId = jobStatusCompleted.Id;
                        //    newJobTracker.PrintingId = jobStatusNotRequired.Id;
                        //    newJobTracker.CardEngrId = jobStatusNotRequired.Id;
                        //    newJobTracker.QAId = jobStatusPending.Id;
                        //    newJobTracker.FirstJobRunId = jobStatusNotRequired.Id;
                        //    newJobTracker.CardEngrResumeId = jobStatusNotRequired.Id;
                        //    newJobTracker.QCId = jobStatusPending.Id;
                        //    newJobTracker.MailingId = jobStatusQueue.Id;
                        //    newJobTracker.DispatchId = jobStatusPending.Id;
                        //    newJobTracker.CustomerServiceId = jobStatusPending.Id;
                        //    newJobTracker.JobTrackerStatusId = jobTrackerStatusPartial.Id;
                        //}
                        //else if (newJobTracker.Job.ServiceTypeId == jobTypePrintingAndPerso.Id)
                        //{
                        //    newJobTracker.InventoryId = jobStatusCompleted.Id;
                        //    newJobTracker.PrintingId = jobStatusQueue.Id;
                        //    newJobTracker.CardEngrId = jobStatusPending.Id;
                        //    newJobTracker.QAId = jobStatusPending.Id;
                        //    newJobTracker.FirstJobRunId = jobStatusPending.Id;
                        //    newJobTracker.CardEngrResumeId = jobStatusPending.Id;
                        //    newJobTracker.QCId = jobStatusPending.Id;
                        //    newJobTracker.MailingId = jobStatusPending.Id;
                        //    newJobTracker.DispatchId = jobStatusPending.Id;
                        //    newJobTracker.CustomerServiceId = jobStatusPending.Id;
                        //    newJobTracker.JobTrackerStatusId = jobTrackerStatusPartial.Id;
                        //}

                        //newJobTracker.InventoryId = jobStatusComplete.Id;
                        //newJobTracker.JobTrackerStatusId = jobTrackerStatusPartial.Id; //Todo
                        //var t1 = await CreateJobTracker(newJobTracker);

                        #endregion

                        // Update CardIssuance
                        issuanceJob.TotalQuantityIssued += entity.TotalQuantityIssued;
                        issuanceJob.TotalQuantityRemain = quantityRemaining;
                        var t33 = await UpdateCardIssuance(issuanceJob.Id, issuanceJob);

                        // Create CardIssuanceLog
                        //var lastIssuance = _repository.CardIssuances.Where(i => i.JobId == job.Id).OrderByDescending(x => x.Id).Take(1).ToList();
                        var newCardIssuanceLog = new CardIssuanceLog()
                        {
                            CardIssuanceId = issuanceJob.Id,
                            IssuanceTypeId = issuanceTypePartial.Id, //Todo
                            TotalQuantity = job.Quantity,
                            QuantityIssued = entity.TotalQuantityIssued,
                            QuantityRemain = quantityRemaining,
                            IssuanceId = userId,
                            CollectorId = entity.CollectorId,
                            IssuedDate = DateTime.Now
                        };
                        var t4 = await CreateCardIssuanceLog(newCardIssuanceLog);

                        ////Todo Where(i => i.CardIssuanceId == lastIssuance[0].Id)
                        ////// After all is done
                        ////// Create JobBatchTracker
                        //var lastIssuanceLog = _repository.CardIssuanceLogs.OrderByDescending(x => x.Id).Take(1).ToList();
                        //var newJobBatchTracker = new JobBatchTracker()
                        //{
                        //    JobId = job.Id,
                        //    JobTrackerId = jobTracker.Id,
                        //    CardIssuanceLogId = lastIssuanceLog[0].Id,
                        //    JobTrackerStatusId = jobTrackerStatusWIP.Id
                        //};

                        //var t2 = await CreateJobBatchTracker(newJobBatchTracker);


                        #endregion
                    }


                    #region MISEntryTest

                    // get ClientStockReport for the day, if null create
                    var newClientStockLog = new ClientStockLog()
                    {
                        ClientStockReportId = clientStockReportForTheDay.Id,
                        CardIssuanceId = issuanceJob.Id,
                        IssuanceQty = entity.TotalQuantityIssued,
                        OpeningStock = clientVaultReport.OpeningStock,
                        ClosingStock = clientVaultReport.OpeningStock - entity.TotalQuantityIssued,
                    };

                    var csl = await CreateClientStockLog(newClientStockLog);

                    // Update ClientVaultReport
                    ClientVaultReport updateClientVaultReport = clientVaultReport2;
                    updateClientVaultReport.ClosingStock -= job.Quantity;

                    // Update ClientStockReport
                    ClientStockReport updateClientStockReport = clientStockReportForTheDay2;
                    //updateClientStockReport.FileName = job.JobName;
                    updateClientStockReport.QtyIssued = job.Quantity;
                    updateClientStockReport.ClosingStock -= job.Quantity;

                    #endregion
                }

            }

            #endregion




            // Todo: StockLog

            return Ok<CardIssuance>(entity);

        }



    }
}
