using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entites;
using API.Helpers;
using API.Interface;
using API.Services;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config) {
            services.AddScoped<ITokenService, TokenService>();
            services.AddAutoMapper(typeof(AutoMapperProfiles).Assembly);
            services.AddScoped<IMessageRepository, MessageRepository>();
            services.AddDbContext<DataContext>(options =>{
                options.UseSqlServer(config.GetConnectionString("DefaultConnection"));
            });
            services.AddDbContext<MargaDharsiContext>(options =>{
                options.UseSqlServer(config.GetConnectionString("DefaultConnection"));
            });

            return services;
        }    
    }
}