using MissionsSystem.Models;

namespace MissionsSystem.Interfaces
{
    public interface IUsersRepository
    {
        ICollection<UsersTbl> GetUsers();
        UsersTbl GetUser(int ID);
        bool CreateUser(UsersTbl user);
        bool UserExists(int ID);
        bool UpdateUser(UsersTbl user);
        bool DeleteUser(UsersTbl user);
        bool Save();
        bool UserLogIn(string username, string password);
        int GetUserID(string username, string password);
        string LogIn(int ID, string hashid);
        bool UsernameExists(string name);
    }
}
