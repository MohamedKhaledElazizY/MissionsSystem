using System.Threading.Tasks;

namespace MissionsSystem.Hubs.Clients
{
    public interface INotificationClient
    {
        Task ReceiveMission(string message);
    }
}
