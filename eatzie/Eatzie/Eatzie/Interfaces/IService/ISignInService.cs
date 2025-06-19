using Eatzie.DTOs;
using Eatzie.DTOs.Request;
using Eatzie.DTOs.Response;
using Eatzie.Helpers;
using System.Threading.Tasks;

namespace Eatzie.Interfaces.IService
{
    public interface ISignInService
    {
        Task<BaseAPIResponse> SignInAsync(SignInRequest request);
    }
}