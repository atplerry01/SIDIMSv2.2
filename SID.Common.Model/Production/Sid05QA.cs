using SID.Common.Model.Infrastructure;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace SID.Common.Model.Production
{
    public class Sid05QA
    {
        public Sid05QA()
        {
            Magstripe = false;
            Indenting = false;
            Embossing = false;
            Picture = false;
            Fulfillment = false;
            Client = false;
            CardType = false;
            Variant = false;
            CardIdNumber = false;
            Bin = false;
            MagstripeTrack = false;
            Cvv = false;
            PanSpacing = false;
        }

        public int Id { get; set; }
        public int JobTrackerId { get; set; }
        public int JobSplitId { get; set; }
        public bool Magstripe { get; set; }
        public bool Indenting { get; set; }
        public bool Embossing { get; set; }
        public bool Picture { get; set; }
        public bool Fulfillment { get; set; }
        public bool Client { get; set; }
        public bool CardType { get; set; }
        public bool PictureView { get; set; }
        public bool Variant { get; set; }
        public bool CardIdNumber { get; set; }
        public bool Bin { get; set; }
        public bool MagstripeTrack { get; set; }
        public bool Cvv { get; set; }
        public bool PanSpacing { get; set; }

        public string CreatedById { get; set; }
        public DateTime CreatedOn { get; set; }


        [ForeignKey("JobTrackerId")]
        public virtual JobTracker JobTracker { get; set; }

        [ForeignKey("JobSplitId")]
        public virtual JobSplit JobSplit { get; set; }

        [ForeignKey("CreatedById")]
        public virtual ApplicationUser CreatedBy { get; set; }

    }
}