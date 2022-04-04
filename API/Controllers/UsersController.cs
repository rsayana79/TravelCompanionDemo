using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using API.Data;
using Microsoft.EntityFrameworkCore;
using API.Entities;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly DataContext _context;

        public UsersController(DataContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpGet(Name = "GetUsers")]
        public async Task<ActionResult<IEnumerable<AppUser>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
             
        }
        
        [Authorize]
        [HttpGet("{id}", Name = "GetUser")]
        public async Task<ActionResult<AppUser>> GetCountry(int id)
        {
            return  await _context.Users.FindAsync(id);
            
        }
        
    }
}