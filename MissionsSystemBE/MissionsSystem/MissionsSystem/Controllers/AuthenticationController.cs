using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MissionsSystem.Interfaces;
using MissionsSystem.Models;
using MissionsSystem.Repository;

namespace MissionsSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController:Controller
    {

        private readonly IAuthenticationsRepository _authenticationsRepository;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IConfiguration _configuration;
        public AuthenticationController(IAuthenticationsRepository authenticationsRepository, IMapper mapper, IHttpContextAccessor httpContextAccessor, IConfiguration configuration)
        {
            _authenticationsRepository = authenticationsRepository;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
            _configuration = configuration;
        }
        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<AuthenticationsTbl>))]
        public IActionResult GetAuthentications()
        {
            var authentications = _authenticationsRepository.GetAuthentications();
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return Ok(authentications);

        }
        [HttpGet("{id}")]
        public IActionResult GetAuthentication(int id)
        {
            if (!_authenticationsRepository.AuthenticationExists(id))
                return NotFound();
            var authentication = _authenticationsRepository.GetAuthentication(id);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return Ok(authentication);
        }

        [HttpPost("{UserID}")]
        public IActionResult CreateAuthentication([FromBody] List<string> authentications,int UserID)
        {
            if (authentications == null)
            {
                return BadRequest(ModelState);
            }
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            //if (GetAuthentication(UserID) == null)
            //{
            //    ModelState.AddModelError("", "حدث خطأ في  الصلاحيات ");
            //    return StatusCode(500, ModelState);
            //}
            if (_authenticationsRepository.AuthenticationExists(UserID))
            {
                //ModelState.AddModelError("", " هذا المستخدم لدية بالفعل صلاحيات ");
                //return StatusCode(500, ModelState);
                _authenticationsRepository.UpdateAuthentication(authentications, UserID);

            }
            if (!_authenticationsRepository.CreateAuthentication(authentications, UserID))
            {
                ModelState.AddModelError("", " حدث خطأ في إضافة الصلاحيات ");
                return StatusCode(500, ModelState);
            }
          
            return Ok(authentications);
        }


        [HttpPut("{UserID}")]
        public IActionResult UpdateAuthentication([FromBody] List<string> authentications, int UserID)
        {
            if (authentications == null)
            {
                return BadRequest(ModelState);
            }

            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            if (!_authenticationsRepository.AuthenticationExists(UserID))
            {
                //ModelState.AddModelError("", " هذا المستخدم لدية بالفعل صلاحيات ");
                //return StatusCode(500, ModelState);
                _authenticationsRepository.CreateAuthentication(authentications, UserID);

            }
            if (!_authenticationsRepository.AuthenticationExists(UserID))
                return NotFound();

            if (!_authenticationsRepository.UpdateAuthentication(authentications,UserID))
            {
                ModelState.AddModelError("", "حدث خطأ في تحديث بيانات المستخدم ");
                return StatusCode(500, ModelState);
            }
            return Ok(authentications);
        }

    }
}
