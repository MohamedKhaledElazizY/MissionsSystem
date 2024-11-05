using MissionsSystem.Models;

namespace MissionsSystem.Interfaces
{
    public interface IAuthenticationsRepository
    {
        ICollection<AuthenticationsTbl> GetAuthentications();

        AuthenticationsTbl GetAuthentication(int ID);
      
        bool CreateAuthentication(List<string> AuthenticationsNames, int id);

        bool AuthenticationExists(int ID);

        bool UpdateAuthentication(List<string> AuthenticationsNames, int id);
    }
}
