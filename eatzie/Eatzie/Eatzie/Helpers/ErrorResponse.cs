using System.Collections.Generic;

namespace Eatzie.Helpers
{
    public class ErrorResponse(int statusCode, string message = "An error occurred.", List<ErrorField>? errorFields = null)
    {
        public int StatusCode { get; set; } = statusCode;
        public string Message { get; set; } = message;

        public List<ErrorField>? ErrorFields { get; set; } = errorFields;
    }

    public class ErrorField
    {
        public string FieldName { get; set; } = string.Empty;
        public string ErrorMessage { get; set; } = string.Empty;
    }
}