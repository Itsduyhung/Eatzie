using Eatzie.Interfaces.IService;
using Eatzie.DTOs.Response;
using Eatzie.Interfaces.IRepository;
using Eatzie.DTOs.Request;

namespace Eatzie.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IPhotoService _photoService;
        private readonly INotificationService _notificationService;

        public UserService(IUserRepository userRepository, IPhotoService photoService, INotificationService notificationService)
        {
            _userRepository = userRepository;
            _photoService = photoService;
            _notificationService = notificationService;
        }

        public async Task<ProfileResponse?> GetProfileAsync(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null) return null;

            return new ProfileResponse
            {
                Id = user.Id,
                Fullname = user.Fullname,
                Email = user.Email,
                Phone = user.Phone,
                Address = user.Address,
                Avatar = user.Avatar,
                CreatedAt = user.CreatedAt
            };
        }

        public async Task<bool> UpdateProfileAsync(int id, ProfileRequest request)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null) return false;

            if (!string.IsNullOrEmpty(request.Fullname))
                user.Fullname = request.Fullname;

            if (!string.IsNullOrEmpty(request.Phone))
                user.Phone = request.Phone;

            if (!string.IsNullOrEmpty(request.Address))
                user.Address = request.Address;

            if (request.Avatar != null && request.Avatar.Length > 0)
            {
                var avatarUrl = await _photoService.UploadPhotoAsync(request.Avatar);
                user.Avatar = avatarUrl;
            }

            await _userRepository.UpdateAsync(user);

            // Create notification after successful profile update
            try
            {
                await _notificationService.CreateNotificationAsync(
                    userId: user.Id,
                    title: "Cập nhật hồ sơ thành công",
                    content: ($"{(string.IsNullOrWhiteSpace(user.Fullname) ? "Bạn" : user.Fullname)} vừa cập nhật thông tin hồ sơ của mình."),
                    type: "success",
                    avatarUrl: user.Avatar
                );
            }
            catch
            {
                // swallow to not block profile update
            }

            return true;
        }
    }
}