using System;
using System.Collections.Generic;

namespace MissionsSystem.Models;

public partial class AuthenticationsTbl
{
    public bool? AddMission { get; set; }

    public bool? EditMission { get; set; }

    public bool? DeleteMission { get; set; }

    public bool? PersonalReview { get; set; }

    public bool? OpenSettings { get; set; }

    public bool? ResetPassword { get; set; }

    public int UserId { get; set; }

    public bool? AddMember { get; set; }

    public bool? AddNewUser { get; set; }

    public bool? AddAuths { get; set; }

    public bool? SetAdmin { get; set; }

    public bool? OpenHistory { get; set; }

    public virtual UsersTbl User { get; set; } = null!;
}
