using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entites;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AirportsController : ControllerBase
    {
        private readonly MargaDharsiContext _context;

        public AirportsController(MargaDharsiContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpGet(Name = "GetAirports")]
        public async Task<ActionResult<IEnumerable<AirportsList>>> GetAirports()
        {
            return await _context.AirportsLists.ToListAsync();
             
        }

        [Authorize]
        [HttpGet("{id}", Name = "GetAirport")]
        public async Task<ActionResult<AirportsList>> GetAirport(int id)
        {
            return  await _context.AirportsLists.FindAsync(id);
            
        }
    }
}