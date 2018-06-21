namespace AuthorizationServer.Api.Models
{
    public class JobTrackerModel
    {
        public JobTrackerModel()
        {
            //Stage = 1;
            StageRequired = 1;
            CurrentState = 1;
            TAT = 0;
            IsPartial = false;
        }

        public int JobId { get; set; }

        public int CardOpsId { get; set; }
        public int InventoryId { get; set; }
        public int PrintingId { get; set; }
        public int CardEngrId { get; set; }
        public int QAId { get; set; }
        public int FirstJobRunId { get; set; }
        public int CardEngrResumeId { get; set; }
        public int QCId { get; set; }
        public int MailingId { get; set; }
        public int DispatchId { get; set; }
        public int CustomerServiceId { get; set; }

        public int StageRequired { get; set; } // Two Stage
        public int CurrentState { get; set; } // Perso
        public float TAT { get; set; }

        public int JobTrackerStatusId { get; set; }

        public bool IsPartial { get; set; }
    }

    public class JobBatchTrackerModel
    {
        public int JobId { get; set; }
        public int JobTrackerId { get; set; }
        public int CardIssuanceLogId { get; set; }
    }

    public class JobAndTrackerModel
    {
        public int JobId { get; set; }

        public string JobName { get; set; }
        public string JobNameId { get; set; }
        public int SidSectorId { get; set; }
        public int SidClientId { get; set; }
        public string Remark { get; set; }
        public int ServiceTypeId { get; set; }
        public int SidCardTypeId { get; set; }

        public int Quantity { get; set; }
        public bool SortingFile { get; set; }
    }

    public class CardIssuanceConfirmationModel
    {
        public int JobId { get; set; }
        public int JobBatchTrackerId { get; set; }
        public int CardIssuanceLogId { get; set; }
    }

}