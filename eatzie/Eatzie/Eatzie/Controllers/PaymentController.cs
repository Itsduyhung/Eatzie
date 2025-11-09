using Eatzie.DTOs.Request;
using Eatzie.Helpers;
using Eatzie.Interfaces.IService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Eatzie.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PaymentController(IPaymentService paymentService) : ControllerBase
    {
        private readonly IPaymentService _paymentService = paymentService;

        [HttpPost("create")]
        public async Task<IActionResult> CreatePayment([FromBody] CreatePaymentRequest request)
        {
            var userId = GetUserIdFromToken.ExtractUserId(HttpContext);
            if (userId == null) return Unauthorized();

            var result = await _paymentService.CreatePaymentLinkAsync(userId.Value, request);
            return StatusCode(result.StatusCode, result);
        }

        [HttpGet("verify/{paymentCode}")]
        public async Task<IActionResult> VerifyPayment(string paymentCode)
        {
            var result = await _paymentService.VerifyPaymentAsync(paymentCode);
            return StatusCode(result.StatusCode, result);
        }

        [HttpGet("order/{orderId}")]
        public async Task<IActionResult> GetPaymentByOrder(int orderId)
        {
            var result = await _paymentService.GetPaymentByOrderIdAsync(orderId);
            return StatusCode(result.StatusCode, result);
        }

        [HttpPost("webhook")]
        [AllowAnonymous]
        public async Task<IActionResult> PayOSWebhook([FromBody] object webhookData)
        {
            // Handle PayOS webhook for payment confirmation
            // This is called by PayOS when payment status changes
            
            try
            {
                // Process webhook data
                // Verify webhook signature for security
                // Update payment status accordingly
                
                return Ok(new { message = "Webhook received successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}



