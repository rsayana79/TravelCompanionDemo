using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entites;

namespace API.Interface
{
    public interface ITokenService
    {
        string CreateToken(User user);
    }
}