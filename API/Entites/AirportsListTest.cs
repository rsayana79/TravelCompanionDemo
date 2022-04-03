using System;
using System.Collections.Generic;

namespace API.Entites
{
    public partial class AirportsListTest
    {
        public long Id { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string Airport { get; set; }
        public string Iatacode { get; set; }
        public string Icaocode { get; set; }
    }
}
