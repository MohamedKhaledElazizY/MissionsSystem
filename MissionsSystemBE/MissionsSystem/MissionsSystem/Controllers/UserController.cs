using AutoMapper;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using MissionsSystem.Dto;
using MissionsSystem.Interfaces;
using MissionsSystem.Models;
using MissionsSystem.Repository;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.Extensions.Primitives;
using System.Security.Cryptography;
using System.Text;
using System;
using Microsoft.AspNetCore.Authorization;
using System.Net;

namespace MissionsSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

  
    public class UserController : Controller
    {
        static SymmetricSecurityKey ke;
        private readonly IUsersRepository _usersRepository;
        private readonly IMapper _mapper;
        private readonly IAuthenticationsRepository _authenticationsRepository;
        private readonly IConfiguration _configuration;
        public UserController (IUsersRepository usersRepository, IMapper mapper,
            IConfiguration configuration, IAuthenticationsRepository authenticationsRepository)
        {
            _usersRepository = usersRepository;
            _mapper = mapper;
            _authenticationsRepository= authenticationsRepository;
            _configuration = configuration;
        }

       [HttpGet]
       [ProducesResponseType(200, Type = typeof(IEnumerable<UsersTbl>))]
        public IActionResult GetUsers() {
            var users = _usersRepository.GetUsers();
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }   
            return Ok(users);

        }

        [HttpGet("{id}")]
        public IActionResult GetUser(int id)
        {
            if (!_usersRepository.UserExists(id))
                return NotFound();
            var user =_usersRepository.GetUser(id);

            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return Ok(user);
        }

        [HttpPost]
        public IActionResult CreateUser([FromBody]UsersTbl user)
        {
            if(user == null)
            {
                return BadRequest(ModelState);
            }
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            if (_usersRepository.UsernameExists(user.UserName) )
            {
                ModelState.AddModelError("", "هذا المستخدم موجود بالفعل  ");
                return StatusCode(500, ModelState);
            }
            if (!_usersRepository.CreateUser(user))
            {
                ModelState.AddModelError("", "حدث خطأ في إضافة المستخدم ");
                return StatusCode(500, ModelState);
            }
            var auths = new List<string> {" "};
            _authenticationsRepository.CreateAuthentication(auths, user.Id);
            return Ok(user);
        }

       [HttpPut("{UserID}")]
        public IActionResult UpdateUser(int UserID,[FromBody] UsersTbl user)
        {
            if (user == null)
            {
                return BadRequest(ModelState);
            }
            if (UserID != user .Id)
                return BadRequest(ModelState);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!_usersRepository.UserExists(UserID))
                return NotFound();

            if (!_usersRepository.UpdateUser(user))
            {
                ModelState.AddModelError("", "حدث خطأ في تحديث بيانات المستخدم ");
                return StatusCode(500, ModelState);
            }
            return Ok(user);
        }
        [HttpPut("ResetPassword/{UserID}")]
        public IActionResult ResetPassword([FromRoute]int UserID, [FromBody] String password)
        {
            if (password == null)
            {
                return BadRequest();
            }

            if (!_usersRepository.UserExists(UserID))
                return NotFound();
            UsersTbl user = _usersRepository.GetUser(UserID);
            System.Security.Cryptography.MD5 md5 = System.Security.Cryptography.MD5.Create();
            byte[] inputBytes = System.Text.Encoding.ASCII.GetBytes(password);
            byte[] hashBytes = md5.ComputeHash(inputBytes);
            password = Convert.ToHexString(hashBytes);
            user.Password=password;
            if (!_usersRepository.UpdateUser(user))
            {
                ModelState.AddModelError("", "حدث خطأ في تحديث بيانات المستخدم ");
                return StatusCode(500, ModelState);
            }
            return Ok(user);
        }
        [HttpDelete]
        public IActionResult DeleteUser(int userID)
        {
            if (userID == null)
            {
                return BadRequest(ModelState);
            }

            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var user=_usersRepository.GetUser(userID);
            var userMap = _mapper.Map<UsersTbl>(user);

            if (!_usersRepository.DeleteUser(userMap))
            {
                ModelState.AddModelError("", "حدث خطأ في حذف المستخدم ");
                return StatusCode(500, ModelState);
            }
            return Ok(user);
        }

       // [Route("api/User/{User_Name}/{Password}")]
        [HttpPost, Route("[action]", Name = "User")]
        //   [HttpGet("{User_Name }/{ Password}")]
     //   [HttpGet]
        public async Task<IActionResult> UserLoginAsync(UsersTblDto User)
        {
            if (!_usersRepository.UserLogIn(User.UserName, User.Password))
                return NotFound();
            int userid = _usersRepository.GetUserID(User.UserName, User.Password);
            var user = _usersRepository.GetUser(userid);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            List<Claim> claims = new List<Claim>() {
                new Claim(ClaimTypes.NameIdentifier, userid.ToString())
                };

           
            var hash = new HMACSHA512();
            
            user.Hash =Convert.ToBase64String( hash.Key);
            hash=new HMACSHA512(System.Text.Encoding.UTF8.GetBytes(user.Hash));
            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_configuration.GetSection("AppSettings:Token").Value));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
            var token = new JwtSecurityToken(claims: claims, signingCredentials: creds, expires: DateTime.Now.AddDays(1));
            _usersRepository.Save();

            string Token = new JwtSecurityTokenHandler().WriteToken(token);
            string id =Convert.ToBase64String(hash.ComputeHash(System.Text.Encoding.UTF8.GetBytes(user.Id.ToString())));
            return Ok(new { Token=Token ,id= id ,user= _mapper.Map<UsersTblDto>(user), 
                auths= _mapper.Map<AuthenticationsTblDto>(_authenticationsRepository.GetAuthentication(userid))});
        }
        
        [HttpGet("Logout"),Authorize]
        public async Task<IActionResult> Logout([FromHeader] int ID, [FromHeader] string hashid)
        {
            string ret = _usersRepository.LogIn(ID, hashid);
            if (ret != "")
            {
                return BadRequest(ret);
            }
            UsersTbl user = _usersRepository.GetUser(ID);
            user.Hash = null;
            _usersRepository.Save();

            return Ok();


        }
    }
}
