using System.Net;
using System.Net.Mail;
using Eatzie.Helpers;
using Eatzie.Interfaces.IService;
using Microsoft.Extensions.Options;

namespace Eatzie.Services
{
    public class EmailService(IOptions<EmailSettings> emailSettings, ILogger<EmailService> logger) : IEmailService
    {
        private readonly ILogger<EmailService> _logger = logger;
        private readonly EmailSettings _emailSettings = emailSettings.Value;

        public async Task SendEmailAsync(string toEmail, string subject, string htmlContent)
        {
            try
            {
                var fromAddress = new MailAddress(_emailSettings.FromEmail, _emailSettings.FromName);
                var toAddress = new MailAddress(toEmail);

                var smtp = new SmtpClient
                {
                    Host = _emailSettings.SmtpServer,
                    Port = _emailSettings.Port,
                    EnableSsl = true,
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    UseDefaultCredentials = false,
                    Credentials = new NetworkCredential(fromAddress.Address, _emailSettings.SmtpPass)
                };

                using var message = new MailMessage(fromAddress, toAddress)
                {
                    Subject = subject,
                    Body = htmlContent,
                    IsBodyHtml = true
                };
                await smtp.SendMailAsync(message);
                _logger.LogInformation("Email đã gửi thành công đến {ToEmail} qua Gmail SMTP.", toEmail);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi gửi email qua Gmail SMTP.");
            }
        }
    }
}