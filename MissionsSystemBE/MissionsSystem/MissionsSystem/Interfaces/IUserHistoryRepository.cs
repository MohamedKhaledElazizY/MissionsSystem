using MissionsSystem.Dto;
using MissionsSystem.Models;

namespace MissionsSystem.Interfaces
{
    public interface IUserHistoryRepository
    {
        ICollection<UserHistoryDto> GetAllUserHistory();
        ICollection<UserHistoryDto> UserHistorySearch(string? userName, DateTime? date);
        bool CreateUserHistory(UserHistory userHistory);
        bool Save();
    }
}
