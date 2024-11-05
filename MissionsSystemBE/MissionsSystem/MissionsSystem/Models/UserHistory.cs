using System;
using System.Collections.Generic;

namespace MissionsSystem.Models;

public partial class UserHistory
{
    public int Id { get; set; }

    public string Action { get; set; } = null!;

    public DateTime DateTime { get; set; }

    public int UserId { get; set; }
}
