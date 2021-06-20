using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.UI.Entities
{
    public enum FriendState
    {
        Adding,
        Editig,
        Deleting,
        Save
    }

    public enum NotificationType
    {
        None,
        Info,
        Success,
        Warning,
        Error
    }
}
