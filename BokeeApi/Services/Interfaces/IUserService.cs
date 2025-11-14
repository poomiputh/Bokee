using DTOs.User;

namespace Services.Interfaces
{
    public interface IUserService
    {
        public Task<bool> SetBookProgress(int userId, int bookId, int page);
    }
}