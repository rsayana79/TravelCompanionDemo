using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class RegisterDTO
    {
        [Required]
        public string UserName { get; set; }    

        [Required]
        [EmailAddress]
        public string EmailId { get; set; } 

        [Required]
        public string password { get; set; }
    }
}