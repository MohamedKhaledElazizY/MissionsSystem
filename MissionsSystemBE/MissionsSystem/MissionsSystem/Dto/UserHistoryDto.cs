using MissionsSystem.Models;

namespace MissionsSystem.Dto
{
    public class UserHistoryDto
    {
        public int Id { get; set; }

        public string Action { get; set; } = null!;

        public DateTime DateTime { get; set; }

        public int UserId { get; set; }
        public string UserName { get; set; }
    }
}
