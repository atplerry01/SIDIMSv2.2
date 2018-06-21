namespace AuthorizationServer.Api.Models
{
    public class CardIssuanceModel
    {
        public int Id { get; set; }
        public int JobId { get; set; }
        public int JobSplitCEAnalysisId { get; set; }
        public int JobTrackerId { get; set; }
        public int TotalQuantity { get; set; }
        public int TotalQuantityIssued { get; set; }
        public int TotalQuantityRemain { get; set; }
        public int TotalWaste { get; set; }
        public string IssuanceId { get; set; }
        public string CollectorId { get; set; }
        public int IssuanceStatusId { get; set; }
        public int variantId { get; set; }
        public string Department { get; set; } // ce, pr, ma, co, qa, qc

    }
}