using System;
using System.Collections.Generic;

namespace MissionsSystem.Models;

public partial class UsersTbl
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string UserName { get; set; } = null!;

    public string Password { get; set; } = null!;
    public string? Hash { get; set; } = null!;
}
