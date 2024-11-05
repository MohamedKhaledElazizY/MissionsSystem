using System;
using System.Collections.Generic;

namespace MissionsSystem.Models;

public partial class OfficersTbl
{
    public int Id { get; set; }

    public string Rank { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string? MilitaryNo { get; set; }

    public string? Phone { get; set; }

    public virtual ICollection<PerMission> PerMissions { get; } = new List<PerMission>();
}
