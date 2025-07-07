using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace Eatzie.DTOs.Request
{
    public class UploadAvatarRequest
    {
        [Required]
        public IFormFile Avatar { get; set; } = null!;

        [Required]
        public int UserId { get; set; }
    }
}