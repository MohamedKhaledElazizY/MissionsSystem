using AutoMapper;
using MissionsSystem.Dto;
using MissionsSystem.Interfaces;
using MissionsSystem.Models;

namespace MissionsSystem.Repository
{
    public class OfficersRepository : IOfficersRepository
    {
        private readonly MissionsDbContext _context;
        private readonly IMapper _mapper;
        public OfficersRepository(MissionsDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public bool CreateOfficer(OfficersTbl officer)
        {
            _context.Add(officer);
            return Save();
        }

        public bool DeleteOfficer(OfficersTbl officer)
        {
            _context.Remove(officer);
            return Save();
        }

        public OfficersTbl GetOfficer(int officerId)
        {
            return _context.OfficersTbls.Where(x => x.Id == officerId).FirstOrDefault();
        }

        public ICollection<OfficersTbl> GetOfficers()
        {
            return _context.OfficersTbls.ToList();
        }

        public ICollection<OfficersTbl> GetOfficersByMission(int missionId)
        {
            return _context.PerMissions.Where(x => x.MissionId == missionId).Select(x => x.Officers).ToList();
        }

        public bool OfficerExists(int officerId)
        {
            return _context.OfficersTbls.Any(x => x.Id == officerId);
        }

        public ICollection<OfficersTbl> OfficersSearch(int? Id, String? Name, String? Rank, String? Phone, String? MilitaryNo)
        {
            List<OfficersTbl> officers = _context.OfficersTbls.ToList();

            if(Id!=null)
                officers=officers.Where(x=>x.Id==Id).ToList();
            if(Name!=null)
                officers = officers.Where(x => x.Name.Contains(Name)).ToList();
            if (Rank != null)
                officers = officers.Where(x => x.Rank.Trim() == Rank).ToList();
            if (Phone != null)
                officers = officers.Where(x => (x.Phone+"").Trim() == Phone).ToList();
            if (MilitaryNo != null)
                officers = officers.Where(x => (x.MilitaryNo+"").Trim() == MilitaryNo).ToList();
            return officers;
        }

        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0 ? true : false;
        }

        public bool UpdateOfficer(OfficersTbl officer)
        {
            _context.Update(officer);
            return Save();
        }
    }
}
