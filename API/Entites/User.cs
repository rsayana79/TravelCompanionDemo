using System;
using System.Collections.Generic;

namespace API.Entites
{
    public partial class User
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string EmailId { get; set; }
        public string Password { get; set; }
    }
}
