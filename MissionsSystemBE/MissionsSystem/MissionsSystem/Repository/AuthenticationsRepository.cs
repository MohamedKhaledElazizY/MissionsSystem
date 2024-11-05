using AutoMapper;
using MissionsSystem.Interfaces;
using MissionsSystem.Models;

namespace MissionsSystem.Repository
{
    public class AuthenticationsRepository:IAuthenticationsRepository
    {

        private readonly MissionsDbContext _context;
        private readonly IMapper _mapper;
        public AuthenticationsRepository(MissionsDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public ICollection<AuthenticationsTbl> GetAuthentications()
        {
            return _context.AuthenticationsTbls.ToList();

        }
        public AuthenticationsTbl GetAuthentication(int id)
        {
            return _context.AuthenticationsTbls.FirstOrDefault(x => x.UserId == id);

        }


     
        public bool AuthenticationExists(int id)
        {
            return _context.AuthenticationsTbls.Any(x => x.UserId == id);
        }



        public bool CreateAuthentication(List<string> AuthenticationsNames, int id)
        {

            AuthenticationsTbl authentications=new AuthenticationsTbl();
            authentications.UserId = id;
            if (AuthenticationsNames.Contains("addMission"))
                authentications.AddMission = true;
            if (AuthenticationsNames.Contains("editMission"))
                authentications.EditMission = true;
            if (AuthenticationsNames.Contains("deleteMission"))
                authentications.DeleteMission = true;
            if (AuthenticationsNames.Contains("addMember"))
                authentications.AddMember = true;
            if (AuthenticationsNames.Contains("addNewUser"))
                authentications.AddNewUser = true;
            if (AuthenticationsNames.Contains("resetPassword"))
                authentications.ResetPassword = true;
            if (AuthenticationsNames.Contains("addAuths"))
                authentications.AddAuths = true;
            if (AuthenticationsNames.Contains("openHistory"))
                authentications.OpenHistory = true;
            if (AuthenticationsNames.Contains("setAdmin"))
                authentications.SetAdmin = true;
            if (AuthenticationsNames.Contains("personalReview"))
                authentications.PersonalReview = true;
            if (AuthenticationsNames.Contains("openSettings"))
                authentications.OpenSettings = true;
           


            _context.Add(authentications);
            return Save();
        }

        public bool UpdateAuthentication(List<string> AuthenticationsNames, int id) {



            AuthenticationsTbl authentications = new AuthenticationsTbl();
            authentications.UserId = id;
            if (AuthenticationsNames.Contains("addMission"))
                authentications.AddMission = true;
            else
                authentications.AddMission = false;

            if (AuthenticationsNames.Contains("editMission"))
                authentications.EditMission = true;
            else
                authentications.EditMission = false;

            if (AuthenticationsNames.Contains("deleteMission"))
                authentications.DeleteMission = true;
            else
                authentications.DeleteMission = false;

            if (AuthenticationsNames.Contains("addMember"))
                authentications.AddMember = true;
            else
                authentications.AddMember = false;

            if (AuthenticationsNames.Contains("addNewUser"))
                authentications.AddNewUser = true;
            else
                authentications.AddNewUser = false;

            if (AuthenticationsNames.Contains("resetPassword"))
                authentications.ResetPassword = true;
            else
                authentications.ResetPassword = false;
            if (AuthenticationsNames.Contains("addAuths"))
                authentications.AddAuths = true;
            else
                authentications.AddAuths = false;

            if (AuthenticationsNames.Contains("openHistory"))
                authentications.OpenHistory = true;
            else
                authentications.OpenHistory = false;

            if (AuthenticationsNames.Contains("setAdmin"))
                authentications.SetAdmin = true;
            else
                authentications.SetAdmin = false;

            if (AuthenticationsNames.Contains("personalReview"))
                authentications.PersonalReview = true;
            else
                authentications.PersonalReview = false;

            if (AuthenticationsNames.Contains("openSettings"))
                authentications.OpenSettings = true;
            else
                authentications.OpenSettings = false;



            _context.Update(authentications);
            return Save();

        }
        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0 ? true : false;
        }

     
    }
}
