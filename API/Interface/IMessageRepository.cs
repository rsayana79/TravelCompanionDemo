using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entites;

namespace API.Interface
{
    public interface IMessageRepository
    {
        void AddMessage(Message message);
        void DeleteMessage(Message message);

        Task<Message> GetMessage(int id);

        Task<IEnumerable<UserDTO>> GetMessagesForUser(int currentUserId);
        Task<IEnumerable<MessageDTO>> GetMessageThread(int senderId, int recipinetId);

        Task<bool> SaveAllAsync();
    }
}