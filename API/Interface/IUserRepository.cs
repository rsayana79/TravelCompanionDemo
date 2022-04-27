using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entites;
using API.Entities;

namespace API.Interface
{
    public interface IUserRepository
    {
        void Update(User user);
        Task<User> GetUserByIdAsync(int id);
        Task<User> GetUserByUsernameAsync(string username);

    }
}