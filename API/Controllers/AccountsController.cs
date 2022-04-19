using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using API.Data;
using API.Entities;
using System.Security.Cryptography;
using System.Text;
using API.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
using API.Interface;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountsController : ControllerBase
    {
        private readonly DataContext _context;

        private readonly ITokenService _tokenService;

        public AccountsController(DataContext context, ITokenService tokenService)
        {
            _tokenService = tokenService;
            _context = context;
        }

        [AllowAnonymous]
        [HttpPost("Register")]
        public async Task<ActionResult<UserDTO>> Register(RegisterDTO registerDTO)
        {
            if (await UserNameExists(registerDTO.UserName)) return BadRequest("User Name is unavailable");
            if (await EmailExists(registerDTO.EmailId)) return BadRequest("Email ID is already registered. Please login into the website");            
            using var hmac = new HMACSHA512();
            var user = new AppUser
            {
                UserName = registerDTO.UserName.ToLower(),
                EmailId = registerDTO.EmailId.ToLower(),
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDTO.password)),
                PasswordSalt = hmac.Key
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return new UserDTO
            {
                Id = user.Id,
                UserName = user.UserName,
                Token = _tokenService.CreateToken(user)
            };

        }

        private async Task<bool> EmailExists(string emailID)
        {
            return await _context.Users.AnyAsync(user => user.EmailId == emailID.ToLower());
        }

        private async Task<bool> UserNameExists(string UserName)
        {
            return await _context.Users.AnyAsync(user => user.UserName == UserName.ToLower());
        }


        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<UserDTO>> Login(LoginDTO loginDTO){
            var user = await _context.Users.SingleOrDefaultAsync(user => (user.UserName == loginDTO.LoginId) ||(user.EmailId == loginDTO.LoginId));            
            if(user== null) return BadRequest("Incorrect user name entered");

            using var hmac = new HMACSHA512(user.PasswordSalt);
            var computerHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDTO.password));
            for(int i = 0; i < computerHash.Length; i++){
                if(computerHash[i]!= user.PasswordHash[i]) return BadRequest("Please enter correct password");
            }
            return new UserDTO
            {
                Id = user.Id,
                UserName = user.UserName,
                Token = _tokenService.CreateToken(user)
            };
        }


    }
}