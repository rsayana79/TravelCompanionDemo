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
        public async Task<bool> AddMessage(Message message)
        {
            _context.Messages.Add(message);
            return  await _context.SaveChangesAsync() > 0;
        }

        public void DeleteMessage(Message message)
        {
            _context.Messages.Remove(message);
        }

        public async Task<Message> GetMessage(int id)
        {
            return await _context.Messages.FindAsync(id);
        }

        public async Task<IEnumerable<UserDTO>> GetUsersWithMessages(int currentUserID)
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
                var user = await _context.Users.FindAsync(userId);
                user.NewMessagesCount = await NewMessageCountBetweenUsers(currentUserID, userId);
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

        public async Task<Group> GetMessageGroup(string groupName)
        {
            return await _context.Groups
                .Include(g => g.Connections)
                .FirstOrDefaultAsync(x => x.Name == groupName);
        }

        public async Task<Group> GetGroupForConnection(string connectionId)
        {
            return await _context.Groups
                .Include(c => c.Connections)
                .Where(c => c.Connections.Any(x => x.ConnectionId == connectionId))
                .FirstOrDefaultAsync();
        }

        public void RemoveConnection(Connection connection)
        {
            _context.Connections.Remove(connection);
        }

        public void AddGroup(Group group)
        {
            _context.Groups.Add(group);
        }

        public async Task<int> NewMessageCountBetweenUsers(int currentUserId, int senderId)
        {
            var messages =await _context.Messages.Where(message => message.RecipientId == currentUserId && message.SenderId == senderId 
                && message.DateRead == null).ToListAsync();        
            return messages.Count;
        }

        public async Task<int> TotalNewMessagesForUser(int currentUserId)
        {
            var messages =await _context.Messages.Where(message => message.DateRead == null && message.RecipientId == currentUserId).ToListAsync();        
            return messages.Count;
        }
    }
}