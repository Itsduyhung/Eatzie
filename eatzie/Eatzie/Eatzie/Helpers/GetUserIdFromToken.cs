using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace Eatzie.Helpers
{
    public static class GetUserIdFromToken
    {
        public static int? ExtractUserId(HttpContext httpContext)
        {
            var userIdStr = httpContext.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (int.TryParse(userIdStr, out int userId))
                return userId;

            return null;
        }
    }
}