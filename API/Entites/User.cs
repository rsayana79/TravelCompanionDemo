using System;
using System.Collections.Generic;

namespace API.Entites
{
    public partial class User
    {
        public User()
        {
            Postings = new HashSet<Posting>();
        }

        public int Id { get; set; }
        public string UserName { get; set; }
        public string EmailId { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }

        public virtual ICollection<Posting> Postings { get; set; }
    }
}
