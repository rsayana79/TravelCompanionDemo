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
        void AddGroup(Group group);
    
        Task<bool> AddMessage(Message message);
        void DeleteMessage(Message message);
        Task<Group> GetMessageGroup(string groupName);
        Task<Message> GetMessage(int id);

        Task<IEnumerable<UserDTO>> GetMessagesForUser(int currentUserId);
        Task<IEnumerable<MessageDTO>> GetMessageThread(int senderId, int recipinetId);

        void RemoveConnection(Connection connection);
        Task<Group> GetGroupForConnection(string connectionId);

        Task<bool> SaveAllAsync();
    }
}