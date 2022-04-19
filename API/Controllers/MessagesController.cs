using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entites;
using API.Extensions;
using API.Helpers;
using API.Interface;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class MessagesController : ControllerBase
    {
        private MargaDharsiContext _context;
        private readonly IMessageRepository _messageRepository;
        private readonly IMapper _mapper;
        public MessagesController(IMessageRepository messageRepository, IMapper mapper, MargaDharsiContext context)
        {
            _mapper = mapper;
            _messageRepository = messageRepository;
            _context = context;
        }

        [HttpPost("CreateMessage")]
        public async Task<ActionResult<MessageDTO>> CreateMessage(CreateMessageDTO createMessageDto)
        {
            var username = User.GetUsername();

            if (username == createMessageDto.RecipientUserName.ToLower())
                return BadRequest("You cannot send messages to yourself");

            var sender = await _context.Users.SingleOrDefaultAsync(user => user.UserName == createMessageDto.SenderUserName);
            Console.WriteLine("Prinitng sender details " + sender);
            var recipient = await _context.Users.SingleOrDefaultAsync(user => user.UserName == createMessageDto.RecipientUserName);

            if (recipient == null) return NotFound();

            var message = new Message
            {
                Sender = sender,
                Recipient = recipient,
                SenderUserName = sender.UserName,
                RecipientUserName = recipient.UserName,
                Content = createMessageDto.Content
            };

            _messageRepository.AddMessage(message);

            if (await _messageRepository.SaveAllAsync()) return Ok(_mapper.Map<MessageDTO>(message));

            return BadRequest("Failed to send message");

        }


        [HttpGet("GetMessagesForUser/{id}")]
        public async Task<IEnumerable<UserDTO>> GetMessagesForUser(int id)
        {
            User user = await _context.Users.SingleOrDefaultAsync(user => user.Id == id);            

            var usersWithMessages = await _messageRepository.GetMessagesForUser(id);



            return usersWithMessages;
        }


        [HttpGet("messagethread/{currentuserId}/{receipientUserId}")]
        public async Task<ActionResult<IEnumerable<MessageDTO>>> GetMessageThread(int currentuserId, int receipientUserId)
        {        
            return Ok(await _messageRepository.GetMessageThread(currentuserId, receipientUserId));
        }
    }
}