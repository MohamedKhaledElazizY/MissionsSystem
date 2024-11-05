using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MissionsSystem.Dto;
using MissionsSystem.Interfaces;
using MissionsSystem.Models;
using MissionsSystem.Repository;

namespace MissionsSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserHistoryController : Controller
    {
        private readonly IUserHistoryRepository _userHistoryRepository;
        private readonly IUsersRepository _usersRepository;
        private readonly IMapper _mapper;

        public UserHistoryController(IUserHistoryRepository userHistoryRepository, IMapper mapper, IUsersRepository usersRepository)
        {
            _userHistoryRepository = userHistoryRepository;
            _usersRepository = usersRepository;
            _mapper = mapper;
        }
        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<UserHistoryDto>))]
        public IActionResult GetAllUserHistory()
        {
            var history = _userHistoryRepository.GetAllUserHistory();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(history);
        }
        [HttpGet("UserHistorySearch")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<UserHistoryDto>))]
        [ProducesResponseType(400)]
        public IActionResult UserHistorySearch([FromQuery] string? userName, [FromQuery] DateTime? date)
        {
            var userHistory = _userHistoryRepository.UserHistorySearch(userName, date);
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            return Ok(userHistory);
        }

    }
}
