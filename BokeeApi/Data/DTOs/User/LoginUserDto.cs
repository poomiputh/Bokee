namespace DTOs.User
{
    public class LoginUserDto
    {
        public required string UserIdentifier { get; set; }
        public required string Password { get; set; }
    }
}