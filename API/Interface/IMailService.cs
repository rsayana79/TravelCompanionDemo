using API.DTOs;
using API.Entites;

namespace API.Interface
{
    public interface IMailService
    {
        Task SendEmailAsync(MailDTO mailRequest);

        Task SendWelcomeEmailAsync(User request);
    }
}