using System;
using System.Collections.Generic;

namespace MissionsSystem.Models;

public partial class MissionTbl
{
    public int MissionId { get; set; }

    public string? FromTime { get; set; }

    public string? ToTime { get; set; }

    public DateTime? FromDate { get; set; }

    public DateTime? ToDate { get; set; }

    public string? Dist { get; set; }

    public string? Reason { get; set; }

    public string? State { get; set; }

    public string? MissionCode { get; set; }

    public string? Notice { get; set; }

    public decimal? OffsNo { get; set; }

    public string? Done { get; set; }

    public decimal? StatNo { get; set; }

    public bool? PersRev { get; set; }
    public string? personalReviewer { get; set; }

    public virtual ICollection<PerMission> PerMissions { get; set; } = new List<PerMission>();
}
