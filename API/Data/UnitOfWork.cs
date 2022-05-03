using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entites;
using API.Interface;
using AutoMapper;
using Microsoft.Extensions.Options;

namespace API.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly IMapper _mapper;
        private readonly MargaDharsiContext _context;

        private readonly IOptions<MailSettings> _mailSettings;
        public UnitOfWork(MargaDharsiContext context, IMapper mapper, IOptions<MailSettings> mailSettings)
        {
            _context = context;
            _mapper = mapper;
            _mailSettings = mailSettings;
        }
        public IUserRepository UserRepository => new UserRepository(_context, _mapper);

        public IMessageRepository MessageRepository => new MessageRepository(_context, _mapper);

        public IMailService MailServiceRepository => new MailServiceRepository(_mailSettings);

        public async Task<bool> Complete()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public bool HasChanges()
        {
            _context.ChangeTracker.DetectChanges();
            var changes = _context.ChangeTracker.HasChanges();

            return changes;
        }
    }
}