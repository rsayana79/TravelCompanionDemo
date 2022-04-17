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

        public async Task<PagedList<MessageDTO>> GetMessagesForUser(MessageParams messageParams)
        {
            var query = _context.Messages.OrderByDescending(message => message.MessageSent).AsQueryable();

            query = messageParams.Container switch
            {
                "Inbox" => query.Where(u => u.RecipientUserName == messageParams.Username
                    && u.UserDeleted == false),
                "Outbox" => query.Where(u => u.SenderUserName == messageParams.Username
                    && u.SenderDeleted == false),
                _ => query.Where(u => u.RecipientUserName ==
                    messageParams.Username && u.UserDeleted == false && u.DateRead == null)
            };

            var messages = query.ProjectTo<MessageDTO>(_mapper.ConfigurationProvider);

            return await PagedList<MessageDTO>.CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);
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

            if(messages.Any()){
                foreach(var message in messages){
                    if(message.RecipientId == currentUserId && message.DateRead == null){
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