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

        Task<IEnumerable<UserDTO>> GetUsersWithMessages(int currentUserId);
        Task<IEnumerable<MessageDTO>> GetMessageThread(int senderId, int recipinetId);

        void RemoveConnection(Connection connection);
        Task<Group> GetGroupForConnection(string connectionId);

        Task<bool> SaveAllAsync();

        Task<int> NewMessageCountBetweenUsers(int currentUserId, int senderId);

        Task<int> TotalNewMessagesForUser(int currentUserId);

        bool IsANewChat(int senderId, int recipientId);

        Task<Connection> GetLatestConnection(string username);
    }
}