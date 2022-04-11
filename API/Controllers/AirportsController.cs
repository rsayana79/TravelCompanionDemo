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
        [Route("GetAirports/{country?}")]
        [HttpGet(Name = "GetAirports")]
        public async Task<ActionResult<IEnumerable<AirportsList>>> GetAirports(string country)
        {
            return await _context.AirportsLists.Where(airport => airport.Country.StartsWith(country)).ToListAsync();
             
        }

        [Authorize]
        [Route("GetAirport/{country}/{airportname?}")]
        [HttpGet(Name = "GetAirport")]
        public async Task<ActionResult<AirportsList>> GetAirport(string airportname, string country)
        {
            return  await _context.AirportsLists.Where(airport => airport.Country == country && (airport.Airport.StartsWith(airportname) || airport.Iatacode.StartsWith(airportname)
            || airport.Icaocode.StartsWith(airportname))).FirstOrDefaultAsync();            
        }
    }
}