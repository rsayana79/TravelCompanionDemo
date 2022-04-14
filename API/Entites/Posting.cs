using System;
using System.Collections.Generic;

namespace API.Entites
{
    public partial class Posting
    {
        public long Id { get; set; }
        public DateTime TravelDate { get; set; }
        public string OriginCountry { get; set; }
        public string OriginAirport { get; set; }
        public string DestinationCountry { get; set; }
        public string DestinationAirport { get; set; }
        public bool EnableEmailNotifications { get; set; }
        public int UserId { get; set; }

        public virtual User User { get; set; }
    }
}
