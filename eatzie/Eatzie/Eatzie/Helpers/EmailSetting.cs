namespace Eatzie.Helpers
{
    public class EmailSettings
    {
        public string SmtpServer { get; set; } = string.Empty;
        public int Port { get; set; }
        public string FromName { get; set; } = string.Empty;
        public string FromEmail { get; set; } = string.Empty;
        public string SmtpUser { get; set; } = string.Empty;
        public string SmtpPass { get; set; } = string.Empty;
    }
}