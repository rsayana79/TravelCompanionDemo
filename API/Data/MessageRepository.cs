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
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class MessageRepository : IMessageRepository
    {
        private readonly MargaDharsiContext _context;
        private readonly IMapper _mapper;

        public MessageRepository(MargaDharsiContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public void AddMessage(Message message)
        {
            _context.Messages.Add(message);
        }

        public void DeleteMessage(Message message)
        {
            _context.Messages.Remove(message);
        }

        public async Task<Message> GetMessage(int id)
        {
            return await _context.Messages.FindAsync(id);
        }

        public async Task<IEnumerable<UserDTO>> GetMessagesForUser(int currentUserID)
        {
            var messages = _context.Messages.Where(message => message.RecipientId == currentUserID || message.SenderId == currentUserID).OrderByDescending(message => message.MessageSent).ToList();

            List<UserDTO> userswithMessage = new List<UserDTO>();
            HashSet<int> distinctUsers = new HashSet<int>();

            foreach (var message in messages)
            {
                //messages sent by the current user
                if (message.SenderId == currentUserID)
                {
                    try
                    {
                        distinctUsers.Add(message.RecipientId);
                    }
                    catch (Exception e)
                    {
                        //user already added. no acrion needed
                        string error = e.Message;
                    }
                }
                //messages received to the current is
                else if (message.RecipientId == currentUserID)
                {
                    try
                    {
                        distinctUsers.Add(message.SenderId);
                    }
                    catch (Exception e)
                    {
                        //user already added. no acrion needed
                        string error = e.Message;
                    }
                }
            }

            foreach (var userId in distinctUsers)
            {
                var user =  await _context.Users.FindAsync(userId);
                userswithMessage.Add(_mapper.Map<UserDTO>(user));
            }

            return userswithMessage.ToList();

        }

        public async Task<IEnumerable<MessageDTO>> GetMessageThread(int currentUserId, int recipinetUserId)
        {
            var messages = await _context.Messages
                .Where(m => m.Recipient.Id == currentUserId && m.UserDeleted == false
                && m.Sender.Id == recipinetUserId
                || m.Recipient.Id == recipinetUserId
                && m.Sender.Id == currentUserId && m.SenderDeleted == false
                )
            .OrderBy(m => m.MessageSent)
            .ToListAsync();

            //var unreadMessages = messages.Where(m => m.DateRead == null && m.Recipient.Id == currentUserId).ToList();

            if (messages.Any())
            {
                foreach (var message in messages)
                {
                    if (message.RecipientId == currentUserId && message.DateRead == null)
                    {
                        message.DateRead = DateTime.Now;
                    }
                }
                await _context.SaveChangesAsync();
            }

            return _mapper.Map<IEnumerable<MessageDTO>>(messages);
        }


        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}