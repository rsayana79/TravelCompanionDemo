using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entites
{
    public class Connection
    {
        public Connection()
        {
        }

        public Connection(string connectionId, string username)
        {
            ConnectionId = connectionId;
            Username = username;
            connectionTime = DateTime.Now;
        }

        public string ConnectionId { get; set; }
        public string Username { get; set; }

        public DateTime connectionTime { get; set; }
    }
}