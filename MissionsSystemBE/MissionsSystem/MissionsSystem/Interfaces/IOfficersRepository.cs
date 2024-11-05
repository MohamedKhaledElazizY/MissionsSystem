using MissionsSystem.Dto;
using MissionsSystem.Models;

namespace MissionsSystem.Interfaces
{
    public interface IOfficersRepository
    {
        ICollection<OfficersTbl> GetOfficers();
        OfficersTbl GetOfficer(int officerId);
        ICollection<OfficersTbl> GetOfficersByMission(int missionId);
        bool OfficerExists(int officerId);
        ICollection<OfficersTbl> OfficersSearch(int? Id, String? Name, String? Rank, String? Phone, String? MilitaryNo);
        bool CreateOfficer(OfficersTbl officer);
        bool UpdateOfficer(OfficersTbl officer);
        bool DeleteOfficer(OfficersTbl officer);
        bool Save();



    }
}
