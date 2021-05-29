using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.UI.Entities
{
    public class Friend
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Initials { get; set; }
        public decimal Amount { get; set; }
        public decimal CxpAmout { get; set; }
        public FriendState State { get; set; }
    }
}
