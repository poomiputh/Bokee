using DTOs.User;

namespace Services.Interfaces
{
    public interface IAccountService
    {
        public Task<int?> RegisterUser(RegisterUserDto userData);
        public Task<string?> LoginUser(LoginUserDto userData);
        public string HashPassword(string password);
        public bool VerifyPassword(string hashedPassword, string password);
        public string GenerateToken(int userId, string username);
    }
}