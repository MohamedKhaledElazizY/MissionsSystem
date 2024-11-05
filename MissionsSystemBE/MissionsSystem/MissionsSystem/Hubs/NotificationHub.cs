using System.Threading.Tasks;
using MissionsSystem.Hubs.Clients;
using Microsoft.AspNetCore.SignalR;

namespace MissionsSystem.Hubs
{
    public class NotificationHub : Hub<INotificationClient>
    {
        public async Task SendMission(string message)
        {
            await Clients.All.ReceiveMission(message);
        }
    }
}
