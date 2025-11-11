namespace Eatzie.Helpers
{
    public class PayOSSettings
    {
        public string ApiKey { get; set; } = string.Empty;
        public string ClientId { get; set; } = string.Empty;
        public string ChecksumKey { get; set; } = string.Empty;
        public string BaseUrl { get; set; } = "https://api.payos.vn/v2";
        public string? ReturnUrl { get; set; }
        public string? CancelUrl { get; set; }
        public string? WebhookUrl { get; set; }
    }
}



