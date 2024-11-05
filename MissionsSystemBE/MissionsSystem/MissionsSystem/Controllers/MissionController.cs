using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using MissionsSystem.Dto;
using MissionsSystem.Interfaces;
using MissionsSystem.Models;
using MissionsSystem.Repository;
using Newtonsoft.Json.Linq;
using System.Reflection;
using System.Security.Claims;

namespace MissionsSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]


    public class MissionController : Controller
    {
        private readonly IMissionsRepository _missionsRepository;
        private readonly IOfficersRepository _officersRepository;
        private readonly IUserHistoryRepository _userHistoryRepository;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IUsersRepository _usersRepository;
        private readonly IMapper _mapper;

        public MissionController(IMissionsRepository missionsRepository, IMapper mapper,
            IOfficersRepository officersRepository, IUserHistoryRepository userHistoryRepository,
            IHttpContextAccessor httpContextAccessor, IUsersRepository usersRepository)
        {
            _missionsRepository = missionsRepository;
            _officersRepository = officersRepository;
            _userHistoryRepository = userHistoryRepository;
            _httpContextAccessor = httpContextAccessor;
            _usersRepository = usersRepository;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<MissionOffecierdto>))]
        public IActionResult GetMissions()
        {
            Request.Headers.TryGetValue("ID", out StringValues ID).ToString();
            Request.Headers.TryGetValue("hashid", out StringValues hashid).ToString();
            string ret = _usersRepository.LogIn(int.Parse(ID), hashid);
            if (ret != "")
            {
                return BadRequest(ret);
            }
            List<MissionTbl> missions = (_missionsRepository.GetMissions()).ToList();
            List<MissionOffecierdto> missionOffeciers= new List<MissionOffecierdto>();
            foreach (var mission in missions) {
                MissionOffecierdto  missionOffecier = new MissionOffecierdto();
                missionOffecier.mission = mission;
                missionOffecier.offecierid = _officersRepository.GetOfficersByMission(mission.MissionId).ToList();
                missionOffeciers.Add(missionOffecier);
                    }
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(missionOffeciers);
        }
        [HttpGet("{missionId}")]
        [ProducesResponseType(200, Type = typeof(MissionOffecierdto))]
        [ProducesResponseType(400)]
        public IActionResult GetMission(int missionId)
        {
            Request.Headers.TryGetValue("ID", out StringValues ID).ToString();
            Request.Headers.TryGetValue("hashid", out StringValues hashid).ToString();
            string ret = _usersRepository.LogIn(int.Parse(ID), hashid);
            if (ret != "")
            {
                return BadRequest(ret);
            }

            if (!_missionsRepository.MissionExists(missionId))
                return NotFound();

            var mission = (_missionsRepository.GetMission(missionId));
            MissionOffecierdto missionOffecier = new MissionOffecierdto();
            missionOffecier.mission = mission;
            missionOffecier.offecierid = _officersRepository.GetOfficersByMission(mission.MissionId).ToList();
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(missionOffecier);
        }

        [HttpGet("MissionSearch")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<MissionTbl>))]
        public IActionResult MissionsSearch([FromQuery]  DateTime? FromDate, [FromQuery] DateTime? ToDate, [FromQuery] String? Name, [FromQuery] String? Rank, [FromQuery] String? Distination)
        {
            Request.Headers.TryGetValue("ID", out StringValues ID).ToString();
            Request.Headers.TryGetValue("hashid", out StringValues hashid).ToString();
            string ret = _usersRepository.LogIn(int.Parse(ID), hashid);
            if (ret != "")
            {
                return BadRequest(ret);
            }

            var missions = (_missionsRepository.MissionSearch(FromDate,ToDate,Name,Rank,Distination));
            List<MissionOffecierdto> missionOffeciers = new List<MissionOffecierdto>();
            foreach (var mission in missions)
            {
                MissionOffecierdto missionOffecier = new MissionOffecierdto();
                missionOffecier.mission = mission;
                missionOffecier.offecierid = _officersRepository.GetOfficersByMission(mission.MissionId).ToList();
                missionOffeciers.Add(missionOffecier);
            }
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(missionOffeciers);
        }

        [HttpPost]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public IActionResult CreateMission([FromBody] MissionOffecierdto missionCreate)
        {
            Request.Headers.TryGetValue("ID", out StringValues ID).ToString();
            Request.Headers.TryGetValue("hashid", out StringValues hashid).ToString();
            string ret = _usersRepository.LogIn(int.Parse(ID), hashid);
            if (ret != "")
            {
                return BadRequest(ret);
            }

            if (missionCreate == null)
                return BadRequest(ModelState);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!_missionsRepository.CreateMission(missionCreate))
            {
                ModelState.AddModelError("", "حدث خطأ في حفظ المأمورية");
                return StatusCode(500, ModelState);
            }
            else
            {
                var userID = int.Parse(ID);
                var userName = _usersRepository.GetUser(userID).UserName;
                var historyRecord = new UserHistory()
                {
                    DateTime = DateTime.Now,
                    Action = $"قام {userName} بإضافة المأمورية {missionCreate.mission.MissionId} : {missionCreate.mission.Dist}",
                    UserId = userID
                };
                _userHistoryRepository.CreateUserHistory(historyRecord);
            }
            return Ok(missionCreate);
        }

        [HttpPut("{missionId}")]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public IActionResult UpdateMission(int missionId, [FromBody] MissionOffecierdto updatedMission)
        {
            Request.Headers.TryGetValue("ID", out StringValues ID).ToString();
            Request.Headers.TryGetValue("hashid", out StringValues hashid).ToString();
            string ret = _usersRepository.LogIn(int.Parse(ID), hashid);
            if (ret != "")
            {
                return BadRequest(ret);
            }

            if (updatedMission == null)
                return BadRequest(ModelState);

            if (missionId != updatedMission.mission.MissionId)
                return BadRequest(ModelState);

            if (!_missionsRepository.MissionExists(missionId))
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest();

            if (!_missionsRepository.UpdateMission(updatedMission))
            {
                ModelState.AddModelError("", "حدث خطأ في تعديل المأمورية");
                return StatusCode(500, ModelState);
            }
            else
            {
                var userID = int.Parse(ID);
                var userName = _usersRepository.GetUser(userID).UserName;
                var historyRecord = new UserHistory()
                {
                    DateTime = DateTime.Now,
                    Action = $"قام {userName} بتعديل المأمورية {updatedMission.mission.MissionId} : {updatedMission.mission.Dist}",
                    UserId = userID
                };
                _userHistoryRepository.CreateUserHistory(historyRecord);
            }

            return NoContent();
        }

        [HttpPut("personalReview/{missionId}")]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public IActionResult UpdatePersonalReviewMission(int missionId, [FromBody] bool personalReview)
        {
            Request.Headers.TryGetValue("ID", out StringValues ID).ToString();
            Request.Headers.TryGetValue("hashid", out StringValues hashid).ToString();
            string ret = _usersRepository.LogIn(int.Parse(ID), hashid);
            if (ret != "")
            {
                return BadRequest(ret);
            }

            var mission = _missionsRepository.GetMission(missionId);
            var userID = int.Parse(ID);
            var reviewer = string.Empty;
            if (personalReview)
                reviewer = _usersRepository.GetUser(userID).Name;

            if (!_missionsRepository.UpdatePersRev(personalReview, missionId, reviewer))
            {
                ModelState.AddModelError("", "حدث خطأ في تعديل المأمورية");
                return StatusCode(500, ModelState);
            }
            else
            {
                var userName = _usersRepository.GetUser(userID).UserName;
                var reviewState = personalReview ? "بطلب" : "بالغاء";
                var historyRecord = new UserHistory()
                {
                    DateTime = DateTime.Now,
                    Action = $"قام {userName} {reviewState} عرض شخصي للمأمورية {mission.MissionId} : {mission.Dist}",
                    UserId = userID
                };
                _userHistoryRepository.CreateUserHistory(historyRecord);
                return Ok(userName);
            }
        }

        [HttpDelete("{missionId}")]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public IActionResult DeleteMission(int missionId)
        {
            Request.Headers.TryGetValue("ID", out StringValues ID).ToString();
            Request.Headers.TryGetValue("hashid", out StringValues hashid).ToString();
            string ret = _usersRepository.LogIn(int.Parse(ID), hashid);
            if (ret != "")
            {
                return BadRequest(ret);
            }

            if (!_missionsRepository.MissionExists(missionId))
            {
                return NotFound();
            }

            var missionToDelete = _missionsRepository.GetMission(missionId);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!_missionsRepository.DeleteMission(missionToDelete))
            {
                ModelState.AddModelError("", "حدث خطأ في حذف المأمورية");
            }
            else
            {
                var userID = int.Parse(ID);
                var userName = _usersRepository.GetUser(userID).UserName;
                var historyRecord = new UserHistory()
                {
                    DateTime = DateTime.Now,
                    Action = $"قام {userName} بحذف مأمورية {missionToDelete.Dist}",
                    UserId = userID
                };
                _userHistoryRepository.CreateUserHistory(historyRecord);
            }

            return NoContent();
        }
    }
}
