using AutoMapper;
using MissionsSystem.Dto;
using MissionsSystem.Interfaces;
using MissionsSystem.Models;

namespace MissionsSystem.Repository
{
    public class MissionsRepository : IMissionsRepository
    {
        private readonly MissionsDbContext _context;
        private readonly IMapper _mapper;
        public MissionsRepository(MissionsDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public bool CreateMission(MissionTbl mission, List<int> officersIds)
        {
            foreach(int i in officersIds) 
            {       
                var officers = _context.OfficersTbls.Where(x => x.Id == i).FirstOrDefault();
                var perMission = new PerMission()
                {
                    Mission = mission,
                    Officers = officers
                };
                _context.Add(perMission);
            }


            _context.Add(mission);
            return Save();
        }
        public bool CreateMission(MissionOffecierdto mission)
        {
            _context.Add(mission.mission);
            Save();
            foreach (OfficersTbl officer in mission.offecierid)
            {
                var perMission = new PerMission()
                {
                    MissionId = mission.mission.MissionId,
                    OfficersId = officer.Id
                };
                _context.Add(perMission);
            }
            return Save();
        }
        public ICollection<MissionTbl> MissionSearch(DateTime? FromDate, DateTime? ToDate, String? Name, String? Rank, String? Distination)
        {
            ICollection<MissionTbl> missions = GetMissions();

            if (FromDate != null)
                missions = missions.Where(x => x.FromDate >= FromDate).ToList();
            if (ToDate != null)
                missions = missions.Where(x => x.ToDate <= ToDate).ToList();
            foreach(MissionTbl mission in missions)
            {
                mission.PerMissions = _context.PerMissions.Where(x=>x.MissionId== mission.MissionId).ToList();
                foreach (PerMission permission in mission.PerMissions)
                {
                    permission.Officers = _context.OfficersTbls.FirstOrDefault(x => x.Id == permission.OfficersId);
                }
            }
            if (Rank != null)
            {
                missions = missions.Where(x => x.PerMissions.Where(x=>x.Officers.Name.Trim()==Name.Trim()&&x.Officers.Rank.Trim()==Rank.Trim()).Any()).ToList();
            }
            if (Distination != null)
                missions = missions.Where(x => (x.Dist + "").Trim().Contains(Distination)).ToList();
            
            return missions;
        }
        public bool DeleteMission(MissionTbl mission)
        {
            _context.PerMissions.RemoveRange(_context.PerMissions.Where(x => x.MissionId == mission.MissionId));
            _context.Remove(mission);
            return Save();
        }

        public MissionTbl GetMission(int missionId)
        {
            return _context.MissionTbls.Where(x => x.MissionId == missionId).FirstOrDefault();
        }

        public ICollection<MissionTbl> GetMissions()
        {
            return _context.MissionTbls.OrderByDescending((e) => e.MissionId).ToList();
        }

        public bool MissionExists(int missionId)
        {
            return _context.MissionTbls.Any(x => x.MissionId == missionId);
        }

        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0 ? true : false;
        }

        public bool UpdateMission(MissionOffecierdto mission)
        {
            MissionTbl mis= GetMission(mission.mission.MissionId);

            if (mission.mission.FromTime != null)
                mis.FromTime = mission.mission.FromTime;

            if (mission.mission.ToTime != null)
                mis.ToTime = mission.mission.ToTime;

            if (mission.mission.FromDate != null)
                mis.FromDate = mission.mission.FromDate;

            if (mission.mission.ToDate != null)
                mis.ToDate = mission.mission.ToDate;

            if (mission.mission.Dist != null)
                mis.Dist = mission.mission.Dist;

            if (mission.mission.Reason != null)
                mis.Reason = mission.mission.Reason;

            if (mission.mission.Notice != null)
                mis.Notice = mission.mission.Notice;

            if (mission.mission.State != null)
                mis.State = mission.mission.State;

            if (mission.mission.MissionCode != null)
                mis.MissionCode= mission.mission.MissionCode;

            if (mission.mission.Notice != null)
                mis.Notice = mission.mission.Notice;

            if (mission.mission.OffsNo != null)
                mis.OffsNo= mission.mission.OffsNo;

            if (mission.mission.Done != null)
                mis.Done = mission.mission.Done;

            if (mission.mission.StatNo != null)
                mis.StatNo= mission.mission.StatNo;

            if (mission.mission.PersRev != null)
                mis.PersRev= mission.mission.PersRev;

            Save();
            var listToDelete = _context.PerMissions.Where(x => x.MissionId == mission.mission.MissionId).ToList();
            foreach(var l in listToDelete) 
            {
                _context.PerMissions.Remove(l);
            }
            Save();
            foreach (OfficersTbl officer in mission.offecierid)
            {
                var perMission = new PerMission()
                {
                    MissionId = mission.mission.MissionId,
                    OfficersId = officer.Id
                };
                _context.Add(perMission);
            }
                return Save();
        }

        public bool UpdatePersRev(bool PersRev,int MissionId, string UserName)
        {
            MissionTbl mis = GetMission(MissionId);
            mis.PersRev = PersRev;
            mis.personalReviewer = UserName;
            return Save();
        }
    }
}
