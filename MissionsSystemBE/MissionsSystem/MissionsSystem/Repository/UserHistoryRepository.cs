using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MissionsSystem.Dto;
using MissionsSystem.Interfaces;
using MissionsSystem.Models;
using System.Collections.Generic;

namespace MissionsSystem.Repository
{
    public class UserHistoryRepository : IUserHistoryRepository
    {
        private readonly MissionsDbContext _context;
        private readonly IMapper _mapper;
        private readonly IUsersRepository _usersRepository;

        public UserHistoryRepository(MissionsDbContext context, IMapper mapper, IUsersRepository usersRepository)
        {
            _context = context;
            _mapper = mapper;
            _usersRepository = usersRepository;
        }
        public bool CreateUserHistory(UserHistory userHistory)
        {
            _context.Add(userHistory);
            return Save();
        }

        public ICollection<UserHistoryDto> GetAllUserHistory()
        {
            var history = _mapper.Map<List<UserHistoryDto>>(_context.UserHistories.ToList().OrderByDescending(x => x.DateTime));
            foreach (var item in history)
            {
                item.UserName = _usersRepository.GetUser(item.UserId).Name;
            }
            return history;
        }

        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0 ? true : false;
        }

        public ICollection<UserHistoryDto> UserHistorySearch(string? userName, DateTime? date)
        {
            ICollection<UserHistoryDto> userHistoryList = _mapper.Map<List< UserHistoryDto>>( GetAllUserHistory());

            if(userName != null)
                userHistoryList = userHistoryList.Where(x => (x.UserName + "").Trim().Contains(userName)).ToList();
            if (date != null)
                userHistoryList = userHistoryList.Where(x => x.DateTime == date).ToList();
            return userHistoryList;
        }
    }
}
