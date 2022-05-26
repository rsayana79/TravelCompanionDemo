using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class PostingDTO
    {
        public long PostingID { get; set; }
        public DateTime TravelDate { get; set; }
        public string OriginCountry { get; set; }
        public string OriginAirport { get; set; }
        public string DestinationCountry { get; set; }
        public string DestinationAirport { get; set; }
        public bool EnableEmailNotifications { get; set; }
        public int UserId { get; set; }

        public string UserName { get; set; }
        
    }
}