using Microsoft.AspNetCore.Components;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.UI.Components
{
    public partial class CxpLogo : ComponentBase
    {
        [Parameter] public bool IsSmallVersion { get; set; } = false;
    }
}
