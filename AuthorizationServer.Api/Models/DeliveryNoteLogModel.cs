namespace AuthorizationServer.Api.Models
{
    public class DeliveryNoteLogModel
    {
        public int SidClientId { get; set; }
        public int DispatchDeliveryId { get; set; }
        public int DeliveryProfileId { get; set; }
        public int JobTrackerId { get; set; }
        public bool HasTemplate { get; set; }
        public string Description { get; set; }
    }

    public class DeliveryWasteLogModel
    {
        public int SidClientId { get; set; }
        public int CardWasteAnalysisId { get; set; }
        public int DeliveryProfileId { get; set; }
        public int JobTrackerId { get; set; }
        public bool HasTemplate { get; set; }
        public string Description { get; set; }
    }
}