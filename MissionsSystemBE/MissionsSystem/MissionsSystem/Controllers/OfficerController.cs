using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.Extensions.Primitives;
using MissionsSystem.Dto;
using MissionsSystem.Interfaces;
using MissionsSystem.Models;
using MissionsSystem.Repository;
using System.Security.Claims;

namespace MissionsSystem.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    
    public class OfficerController : Controller
    {
        private readonly IOfficersRepository _officersRepository;
        private readonly IUserHistoryRepository _userHistoryRepository;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IUsersRepository _usersRepository;
        private readonly IMapper _mapper;

        public OfficerController(IOfficersRepository officersRepository, IMapper mapper, IUsersRepository usersRepository,
            IUserHistoryRepository userHistoryRepository, IHttpContextAccessor httpContextAccessor)
        {
            _officersRepository = officersRepository;
            _userHistoryRepository = userHistoryRepository;
            _httpContextAccessor = httpContextAccessor;
            _usersRepository = usersRepository;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<OfficersTbl>))]
        public IActionResult GetOfficers()
        {
            Request.Headers.TryGetValue("ID", out StringValues ID).ToString();
            Request.Headers.TryGetValue("hashid", out StringValues hashid).ToString();
            string ret = _usersRepository.LogIn(int.Parse(ID.First()), hashid.First());
            if (ret != "")
            {
                return BadRequest(ret);
            }

            //var userID = int.Parse(_httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier).ToString());
            var officers = _mapper.Map<List<OfficersTblDto>>(_officersRepository.GetOfficers());

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(officers);
        }
        [HttpGet("OfficersSearch")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<OfficersTbl>))]
        public IActionResult OfficersSearch([FromQuery] int? Id,[FromQuery] String? Name, [FromQuery] String? Rank,
            [FromQuery] String? Phone, [FromQuery] String? MilitaryNo)
        {
            Request.Headers.TryGetValue("ID", out StringValues ID).ToString();
            Request.Headers.TryGetValue("hashid", out StringValues hashid).ToString();
            string ret = _usersRepository.LogIn(int.Parse(ID), hashid);
            if (ret != "")
            {
                return BadRequest(ret);
            }

            var officers = _mapper.Map<List<OfficersTblDto>>(_officersRepository.OfficersSearch( Id,  Name,  Rank,  Phone,  MilitaryNo));

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(officers);
        }
        [HttpGet("{officerId}")]
        [ProducesResponseType(200, Type = typeof(OfficersTbl))]
        [ProducesResponseType(400)]
        public IActionResult GetOfficer(int officerId)
        {
            Request.Headers.TryGetValue("ID", out StringValues ID).ToString();
            Request.Headers.TryGetValue("hashid", out StringValues hashid).ToString();
            string ret = _usersRepository.LogIn(int.Parse(ID), hashid);
            if (ret != "")
            {
                return BadRequest(ret);
            }


            if (!_officersRepository.OfficerExists(officerId))
                return NotFound();

            var officer = _mapper.Map<OfficersTblDto>(_officersRepository.GetOfficer(officerId));

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(officer);
        }

        [HttpGet("officer/{missionId}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<OfficersTbl>))]
        [ProducesResponseType(400)]
        public IActionResult GetOfficersByMission(int missionId)
        {
            Request.Headers.TryGetValue("ID", out StringValues ID).ToString();
            Request.Headers.TryGetValue("hashid", out StringValues hashid).ToString();
            string ret = _usersRepository.LogIn(int.Parse(ID), hashid);
            if (ret != "")
            {
                return BadRequest(ret);
            }


            var officers = _mapper.Map<List<OfficersTblDto>>(
                _officersRepository.GetOfficersByMission(missionId));

            if (!ModelState.IsValid)
                return BadRequest();

            return Ok(officers);
        }
        [HttpPost]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public IActionResult CreateOfficer([FromBody] OfficersTblDto officerCreate)
        {
            Request.Headers.TryGetValue("ID", out StringValues ID).ToString();
            Request.Headers.TryGetValue("hashid", out StringValues hashid).ToString();
            string ret = _usersRepository.LogIn(int.Parse(ID), hashid);
            if (ret != "")
            {
                return BadRequest(ret);
            }


            if (officerCreate == null)
                return BadRequest(ModelState);

            var officer = _officersRepository.GetOfficers()
                .Where(c => c.Name.Trim().ToUpper() == officerCreate.Name.TrimEnd().ToUpper())
                .FirstOrDefault();

            if (officer != null)
            {
                ModelState.AddModelError("", "هذا الفرد موجود");
                return StatusCode(422, ModelState);
            }

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var officerMap = _mapper.Map<OfficersTbl>(officerCreate);

            if (!_officersRepository.CreateOfficer(officerMap))
            {
                ModelState.AddModelError("", "حدث خطأ في حفظ الفرد");
                return StatusCode(500, ModelState);
            }
            else
            {
                var userID = int.Parse(ID);
                var userName = _usersRepository.GetUser(userID).UserName;
                var historyRecord = new UserHistory()
                {
                    DateTime = DateTime.Now,
                    Action = $"قام {userName} بإضافة الفرد {officerCreate.Rank}/ {officerCreate.Name}",
                    UserId = userID
                };
                _userHistoryRepository.CreateUserHistory(historyRecord);
            }

            return Ok("Successfully created");
        }

        [HttpPut("{officerId}")]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public IActionResult UpdateOfficer(int officerId, [FromBody] OfficersTblDto updatedOfficer)
        {
            Request.Headers.TryGetValue("ID", out StringValues ID).ToString();
            Request.Headers.TryGetValue("hashid", out StringValues hashid).ToString();
            string ret = _usersRepository.LogIn(int.Parse(ID), hashid);
            if (ret != "")
            {
                return BadRequest(ret);
            }


            if (updatedOfficer == null)
                return BadRequest(ModelState);

            if (officerId != updatedOfficer.Id)
                return BadRequest(ModelState);

            if (!_officersRepository.OfficerExists(officerId))
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest();

            var officerMap = _mapper.Map<OfficersTbl>(updatedOfficer);

            if (!_officersRepository.UpdateOfficer(officerMap))
            {
                ModelState.AddModelError("", "حدث خطأ في تعديل الفرد");
                return StatusCode(500, ModelState);
            }
            else
            {
                var userID = int.Parse(ID);
                var userName = _usersRepository.GetUser(userID).UserName;
                var historyRecord = new UserHistory()
                {
                    DateTime = DateTime.Now,
                    Action = $"قام {userName} بتعديل الفرد {updatedOfficer.Rank}/ {updatedOfficer.Name}",
                    UserId = userID
                };
                _userHistoryRepository.CreateUserHistory(historyRecord);
            }

            return NoContent();
        }

        [HttpDelete("{officerId}")]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public IActionResult DeleteOfficer(int officerId)
        {
            Request.Headers.TryGetValue("ID", out StringValues ID).ToString();
            Request.Headers.TryGetValue("hashid", out StringValues hashid).ToString();
            string ret = _usersRepository.LogIn(int.Parse(ID), hashid);
            if (ret != "")
            {
                return BadRequest(ret);
            }

            if (!_officersRepository.OfficerExists(officerId))
            {
                return NotFound();
            }

            var officerToDelete = _officersRepository.GetOfficer(officerId);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!_officersRepository.DeleteOfficer(officerToDelete))
            {
                ModelState.AddModelError("", "حدث خطأ في حذف الفرد");
            }
            else
            {
                var userID = int.Parse(ID);
                var userName = _usersRepository.GetUser(userID).UserName;
                var historyRecord = new UserHistory()
                {
                    DateTime = DateTime.Now,
                    Action = $"قام {userName} بحذف الفرد {officerToDelete.Rank}/{officerToDelete.Name}",
                    UserId = userID
                };
                _userHistoryRepository.CreateUserHistory(historyRecord);
            }

            return NoContent();
        }
    }
}
