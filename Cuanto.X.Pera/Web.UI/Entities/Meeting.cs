using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.UI.Entities
{
    public class Meeting
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime Date { get; set; }
        public List<Friend> Friends { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal CxpAmount { get; set; }
    }
}
