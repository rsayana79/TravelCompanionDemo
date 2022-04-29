using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entites;
using API.Extensions;
using API.Interface;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    [Authorize]
    public class MessageHub : Hub
    {
        private readonly IMapper _mapper;

        //private int currentUserID;
        private readonly IUnitOfWork _unitOfWork;

        private readonly PresenceTracker _tracker;
        private readonly IHubContext<PresenceHub> _presenceHub;

        public MessageHub(IMapper mapper, IUnitOfWork unitOfWork, IHubContext<PresenceHub> presenceHub,
            PresenceTracker tracker)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _presenceHub = presenceHub;
            _tracker = tracker;
        }

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var currentUserID = int.Parse(httpContext.Request.Query["userid"]);
            var otherUserID = int.Parse(httpContext.Request.Query["user"].ToString());
            var user = await _unitOfWork.UserRepository.GetUserByIdAsync(otherUserID);
            var currentUser = await _unitOfWork.UserRepository.GetUserByIdAsync(currentUserID);
            await GetUsersWithMessages(currentUser);
            var groupName = GetGroupName(Context.User.GetUsername(), user.UserName);
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            var group = await AddToGroup(groupName);
            await Clients.Group(groupName).SendAsync("UpdatedGroup", group);
            await GetMessageThread(currentUserID, user.Id);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var group = await RemoveFromMessageGroup();
            await Clients.Group(group.Name).SendAsync("UpdatedGroup", group);
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(MessageDTO createMessageDto)
        {
            //var username = Context.User.GetUsername();

            if (createMessageDto.SenderId == createMessageDto.RecipientId)
                throw new HubException("You cannot send messages to yourself");

            var sender = await _unitOfWork.UserRepository.GetUserByUsernameAsync(createMessageDto.SenderUserName);
            var recipient = await _unitOfWork.UserRepository.GetUserByUsernameAsync(createMessageDto.RecipientUserName);

            if (recipient == null) throw new HubException("Not found user");

            var message = new Message
            {
                Sender = sender,
                Recipient = recipient,
                SenderUserName = sender.UserName,
                RecipientUserName = recipient.UserName,
                Content = createMessageDto.Content
            };

            var groupName = GetGroupName(sender.UserName, recipient.UserName);

            var group = await _unitOfWork.MessageRepository.GetMessageGroup(groupName);
            /* 
                        if (group !=null && group.Connections.Any(x => x.Username == recipient.UserName))
                        {
                            message.DateRead = DateTime.UtcNow;
                        } */
            if (!(group != null && group.Connections.Any(x => x.Username == recipient.UserName)))
            {
                var connections = await _tracker.GetConnectionsForUser(recipient.UserName);
                if (connections != null)
                {
                    await _presenceHub.Clients.Clients(connections).SendAsync("NewMessageReceived",
                        new { username = sender.UserName });
                }
            }


            /*             if(createMessageDto.CurrentUserID == sender.Id){
                            await GetUsersWithMessages(recipient);            
                        }
                        else if(createMessageDto.CurrentUserID == recipient.Id){
                            await GetUsersWithMessages(sender);
                        } */

            if (await _unitOfWork.MessageRepository.AddMessage(message))
            {
                await Clients.Group(groupName).SendAsync("NewMessage", _mapper.Map<MessageDTO>(message));
            }
        }

        public async Task GetMessageThread(int senderId, int recipientId)
        {
            var messages = await _unitOfWork.MessageRepository.GetMessageThread(senderId, recipientId);

            if (_unitOfWork.HasChanges()) await _unitOfWork.Complete();

            await Clients.Caller.SendAsync("ReceiveMessageThread", messages);

        }

        private async Task<Group> AddToGroup(string groupName)
        {
            var group = await _unitOfWork.MessageRepository.GetMessageGroup(groupName);
            var connection = new Connection(Context.ConnectionId, Context.User.GetUsername());

            if (group == null)
            {
                group = new Group(groupName);
                _unitOfWork.MessageRepository.AddGroup(group);
            }

            group.Connections.Add(connection);

            if (await _unitOfWork.Complete()) return group;

            throw new HubException("Failed to join group");
        }

        private async Task<Group> RemoveFromMessageGroup()
        {
            var group = await _unitOfWork.MessageRepository.GetGroupForConnection(Context.ConnectionId);
            var connection = group.Connections.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);
            _unitOfWork.MessageRepository.RemoveConnection(connection);
            if (await _unitOfWork.Complete()) return group;

            throw new HubException("Failed to remove from group");
        }

        private string GetGroupName(string caller, string other)
        {
            var stringCompare = string.CompareOrdinal(caller, other) < 0;
            return stringCompare ? $"{caller}-{other}" : $"{other}-{caller}";
        }

        public async Task<IEnumerable<UserDTO>> GetUsersWithMessages(User user)
        {
            var users = await _unitOfWork.MessageRepository.GetUsersWithMessages(user.Id);
            if (_unitOfWork.HasChanges()) await _unitOfWork.Complete();

            await Clients.Caller.SendAsync("GetUsersWithMessages", users);
            return users;

        }

/*         public async Task<UserDTO> MessageFromNewUser(User user)
        {
            await Clients.Caller.SendAsync("MessageFromNewUser", user);
            return _mapper.Map<UserDTO>(user);
        } */
    }
}