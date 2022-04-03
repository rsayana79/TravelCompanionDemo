using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using API.Entites;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class CountriesController : ControllerBase
    {
        private readonly MargaDharsiContext _context;

        public CountriesController(MargaDharsiContext context)
        {
            _context = context;
        }

        [HttpGet(Name = "GetCountries")]
        public async Task<ActionResult<IEnumerable<Country>>> GetCountries()
        {
            return await _context.Countries.ToListAsync();
             
        }

        [HttpGet("{id}", Name = "GetCountry")]
        public async Task<ActionResult<Country>> GetCountry(int id)
        {
            return  await _context.Countries.FindAsync(id);
            
        }
    }
}