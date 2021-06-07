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
        public string Initials => Name.Length > 1 ? Name.Substring(0, 2).ToUpper() : Name.ToUpper();
        public decimal Amount { get; set; }
        public decimal CxpAmout { get; set; }
        public FriendState State { get; set; }
    }
}
