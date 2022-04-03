using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class LoginDTO
    {
        [Required]
        public string LoginId { get; set; } 

        [Required]
        public string password { get; set; }
    }
}