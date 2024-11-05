using AutoMapper;
using Azure.Core;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Primitives;
using MissionsSystem.Interfaces;
using MissionsSystem.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Cryptography;

namespace MissionsSystem.Repository
{
    public class UsersRepository : IUsersRepository
    {
        private readonly MissionsDbContext _context;
        private readonly IMapper _mapper;

        public UsersRepository(MissionsDbContext context, IMapper mapper) {
            _context = context;
            _mapper = mapper;

        }
        public ICollection<UsersTbl> GetUsers()
        {

            return _context.UsersTbls.ToList();

        }
        public bool CreateUser(UsersTbl user)
        {
            System.Security.Cryptography.MD5 md5 = System.Security.Cryptography.MD5.Create();
            byte[] inputBytes = System.Text.Encoding.ASCII.GetBytes(user.Password);
            byte[] hashBytes = md5.ComputeHash(inputBytes);

            user.Password= Convert.ToHexString(hashBytes);
            _context.Add(user);
            return Save();
        }
        public bool UpdateUser(UsersTbl user)
        {
            _context.Update(user);
            return Save();
        }
        public bool DeleteUser(UsersTbl user)
        {
            _context.Remove(user);
            return Save();
        }

       
        public UsersTbl GetUser(int id)
        {
            return _context.UsersTbls.Where(x => x.Id == id).FirstOrDefault();
        }

        public bool UserExists(int id)
        {
            return _context.UsersTbls.Any(x => x.Id == id);
        }
        public bool UsernameExists(string name)
        {
            return _context.UsersTbls.Any(x => x.UserName == name);
        }
        public bool UserLogIn(string username, string password)
        {
            System.Security.Cryptography.MD5 md5 = System.Security.Cryptography.MD5.Create();
            byte[] inputBytes = System.Text.Encoding.ASCII.GetBytes(password);
            byte[] hashBytes = md5.ComputeHash(inputBytes);
            password = Convert.ToHexString(hashBytes);
            return _context.UsersTbls.Any(x=>x.UserName== username && x.Password == password);
        }

        public int GetUserID(string username, string password)
        {
            System.Security.Cryptography.MD5 md5 = System.Security.Cryptography.MD5.Create();
            byte[] inputBytes = System.Text.Encoding.ASCII.GetBytes(password);
            byte[] hashBytes = md5.ComputeHash(inputBytes);

            password = Convert.ToHexString(hashBytes);
            int userid=    _context.UsersTbls.FirstOrDefault(x => x.UserName == username && x.Password == password).Id;
            return userid;

        }
        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0 ? true : false;
        }
        public string LogIn(int ID, string hashid)
        {

            //try
            //{
            //    JwtSecurityToken j = (new JwtSecurityTokenHandler().ReadJwtToken(Token));
            //}
            //catch(Exception ex) {
            //    return ("invalid token");
            //}
            if (!UserExists(ID))
            {
                return ("id not exist");
            }
            var user = GetUser(ID);

            var hash = new HMACSHA512(System.Text.Encoding.UTF8.GetBytes(user.Hash));
            string IDuserid = Convert.ToBase64String(hash.ComputeHash(System.Text.Encoding.UTF8.GetBytes(user.Id.ToString())));
            if (hashid != IDuserid)
            {
                return ("invalid hased id");
            }
            return ("");
        }

    }
}
