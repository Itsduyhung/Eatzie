namespace Eatzie.Helpers;

public class BaseAPIResponse
{
    public string Message { get; set; } = string.Empty;
    public int StatusCode { get; set; }
    public bool IsSuccess { get; set; }
    public object? Data { get; set; }

    public BaseAPIResponse() { }

    public BaseAPIResponse(string message, int statusCode, bool isSuccess)
    {
        Message = message;
        StatusCode = statusCode;
        IsSuccess = isSuccess;
    }
}