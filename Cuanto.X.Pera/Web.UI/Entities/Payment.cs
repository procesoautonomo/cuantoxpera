using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.UI.Entities
{
    public class Payment
    {
        public Payer FriendPayer { get; set; }
        public Collector FriendCollector { get; set; }
        public decimal PaymentAmount { get; set; }
        public decimal RoundedPaymentAmount { get; set; }
    }
}
