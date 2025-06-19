namespace Eatzie.Helpers
{
    public class BaseAPIResponse<T>
    {
        public T? Data { get; set; }
        public string Message { get; set; } = string.Empty;
        public int StatusCode { get; set; }
        public bool IsSuccess { get; set; }

        public BaseAPIResponse() { }

        public BaseAPIResponse(T data, string message = "Success", int statusCode = 200, bool isSuccess = true)
        {
            Data = data;
            Message = message;
            StatusCode = statusCode;
            IsSuccess = isSuccess;
        }
    }
}