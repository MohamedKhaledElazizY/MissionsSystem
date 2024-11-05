using System;
using System.Collections.Generic;

namespace MissionsSystem.Models;

public partial class PerMission
{
    public int MissionId { get; set; }

    public int OfficersId { get; set; }

    public virtual MissionTbl Mission { get; set; } = null!;

    public virtual OfficersTbl Officers { get; set; } = null!;
}
