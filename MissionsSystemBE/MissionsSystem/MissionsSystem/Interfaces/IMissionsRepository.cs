using MissionsSystem.Dto;
using MissionsSystem.Models;

namespace MissionsSystem.Interfaces
{
    public interface IMissionsRepository
    {
        ICollection<MissionTbl> GetMissions();
        MissionTbl GetMission(int missionId);
        //ICollection<MissionTbl> GetMissionsByOfficerId(int officerId);
        bool MissionExists(int missionId);
        bool CreateMission(MissionOffecierdto mission);
        bool CreateMission(MissionTbl mission, List<int> officersIds);
        ICollection<MissionTbl> MissionSearch(DateTime? FromDate, DateTime? ToDate, String? Name, String? Rank, String? Distination);
        bool UpdateMission(MissionOffecierdto mission);
        bool UpdatePersRev(bool PersRev, int MissionId, string UserName);
        bool DeleteMission(MissionTbl mission);
        bool Save();
    }
}
