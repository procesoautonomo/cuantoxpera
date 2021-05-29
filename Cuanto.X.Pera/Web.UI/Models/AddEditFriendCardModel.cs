using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Web.UI.Entities;

namespace Web.UI.Models
{
    public class AddEditFriendCardModel
    {
        public Friend Friend { get; set; }
        public string Initials { get; set; }
        public bool IsEditing { get; set; }
    }
}
