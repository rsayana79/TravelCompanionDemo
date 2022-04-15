using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entites;
using API.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PostingsController : ControllerBase
    {
        private readonly MargaDharsiContext _context;

        private readonly ITokenService _tokenService;

        public PostingsController(MargaDharsiContext context, ITokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }


        [Authorize]
        [HttpPost("AddPosting")]
        public async Task<ActionResult<PostingDTO>> AddPosting(PostingDTO postingDTO)
        {
            var posting = new Posting{
                TravelDate = postingDTO.TravelDate,
                OriginCountry = postingDTO.OriginCountry,
                OriginAirport = postingDTO.OriginAirport,
                DestinationCountry = postingDTO.DestinationCountry,
                DestinationAirport = postingDTO.DestinationAirport,
                EnableEmailNotifications = postingDTO.EnableEmailNotifications,
                UserId = postingDTO.UserId
            };
            _context.Postings.Add(posting);
            await _context.SaveChangesAsync();
            return postingDTO;
        }


        [Authorize]
        [Route("GetPostings/{travelDate?}")]
        [HttpGet(Name = "GetPostings")]
        public async Task<ActionResult<IEnumerable<Posting>>> GetPostings(string travelDate)
        {
            Console.WriteLine(travelDate);
            DateTime parsedTravelDate = DateTime.Parse(travelDate);
            return  await _context.Postings.Where(country => country.TravelDate == parsedTravelDate).ToListAsync();
             
        }
    }
}