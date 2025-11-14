namespace DTOs.User
{
    public class LoginUserResponseDto
    {
        public UserDto User { get; set; } = default!;
        public required string Token { get; set; }
    }
}