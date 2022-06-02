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
using API.Entites;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountsController : ControllerBase
    {
        private readonly MargaDharsiContext _context;

        private readonly ITokenService _tokenService;

        private readonly IMessageRepository _messageRepository;

        private readonly IUnitOfWork _unitOfWork;

        public AccountsController(MargaDharsiContext context, ITokenService tokenService, IMessageRepository messageRepository, IUnitOfWork unitOfWork)
        {
            _tokenService = tokenService;
            _context = context;
            _messageRepository = messageRepository;
            _unitOfWork = unitOfWork;
        }

        [AllowAnonymous]
        [HttpPost("Register")]
        public async Task<ActionResult<UserDTO>> Register(RegisterDTO registerDTO)
        {
            if (await UserNameExists(registerDTO.UserName)) return BadRequest("User Name is unavailable");
            if (await EmailExists(registerDTO.EmailId)) return BadRequest("Email ID is already registered. Please login into the website");
            using var hmac = new HMACSHA512();
            Random generator = new Random();
            string validationPin = generator.Next(0, 1000000).ToString("D6");
            var user = new User
            {
                UserName = registerDTO.UserName.ToLower(),
                EmailId = registerDTO.EmailId.ToLower(),
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDTO.password)),
                PasswordSalt = hmac.Key,
                EmailValidated = false,
                VerificationCode = validationPin
            };
            await _unitOfWork.MailServiceRepository.SendWelcomeEmailAsync(user);
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return new UserDTO
            {
                UserName = user.UserName,
                Token = null,
                NewMessagesCount = 0,
                ValidationCode = validationPin
            };

        }

        [AllowAnonymous]
        [HttpPost("ValidateEmail/{emailId}/{code}")]
        public async Task<ActionResult<bool>> validateEmail(string emailId, string code)
        {
            try
            {
                var newUser = await _context.Users.Where(u => u.EmailId == emailId).FirstAsync();
                if (newUser.VerificationCode == code)
                {
                    newUser.EmailValidated = true;
                }
                else
                {
                    return BadRequest("Verification code mismatch");
                }
            }
            catch (Exception) { return BadRequest("Could not find the user"); }
            await _context.SaveChangesAsync();
            return true;
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
        public async Task<ActionResult<UserDTO>> Login(LoginDTO loginDTO)
        {
            var user = await _context.Users.SingleOrDefaultAsync(user => (user.UserName == loginDTO.LoginId) || (user.EmailId == loginDTO.LoginId));
            if (user == null) return BadRequest("Incorrect user name entered");
            if (!user.EmailValidated) return BadRequest("Email ID is not validated. Please validate the account using the link shared in the email");
            using var hmac = new HMACSHA512(user.PasswordSalt);
            var computerHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDTO.password));
            for (int i = 0; i < computerHash.Length; i++)
            {
                if (computerHash[i] != user.PasswordHash[i]) return BadRequest("Please enter correct password");
            }
            return new UserDTO
            {
                Id = user.Id,
                UserName = user.UserName,
                Token = _tokenService.CreateToken(user),
                NewMessagesCount = await _messageRepository.TotalNewMessagesForUser(user.Id)
            };
        }


    }
}