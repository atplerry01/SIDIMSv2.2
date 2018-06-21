using System.ComponentModel.DataAnnotations.Schema;

namespace SID.Common.Model.Lookups
{
    public class DeliveryNoteClientTemplate
    {
        // {{ Create Client Default NoTemplate}}
        public int Id { get; set; }
        public int DeliveryNoteId { get; set; }
        public int DeliveryNoteTemplateId { get; set; }
        

        [ForeignKey("DeliveryNoteId")]
        public virtual DeliveryProfile DeliveryProfile { get; set; }

        [ForeignKey("DeliveryNoteTemplateId")]
        public virtual DeliveryNoteTemplate DeliveryNoteTemplate { get; set; }


    }
}