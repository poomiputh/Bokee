using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Data;
using Data.Models;
using DTOs.User;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Services.Interfaces;

namespace Services
{
    public class AccountService : IAccountService
    {
        private readonly BokeeDbContext _dbContext;
        private readonly IConfiguration _config;
        private readonly PasswordHasher<string> _passwordHasher;

        public AccountService(BokeeDbContext dbContext, IConfiguration config)
        {
            _dbContext = dbContext;
            _config = config;
            _passwordHasher = new PasswordHasher<string>();
        }

        public async Task<int?> RegisterUser(RegisterUserDto userData)
        {
            User? user = await _dbContext.Users
                 .Where(u => u.Username == userData.Username || u.Email == userData.Email)
                 .FirstOrDefaultAsync();
            if (user != null) return null;

            DateTime utcNow = DateTime.UtcNow;
            User newUser = new User
            {
                Username = userData.Username,
                Email = userData.Email,
                Password = HashPassword(userData.Password),
                CreatedDate = utcNow,
                ModifiedDate = utcNow
            };

            await _dbContext.Users.AddAsync(newUser);
            await _dbContext.SaveChangesAsync();

            return newUser.Id;
        }

        public async Task<LoginUserResponseDto?> LoginUser(LoginUserDto userData)
        {
            User? user = await _dbContext.Users
                .Where(u => u.Username == userData.UserIdentifier || u.Email == userData.UserIdentifier)
                .FirstOrDefaultAsync();
            if (user == null) return null;

            bool passwordMatched = VerifyPassword(user.Password, userData.Password);
            if (!passwordMatched) return null;

            var token = GenerateToken(user.Id, user.Username);

            return new LoginUserResponseDto
            {
                User = new UserDto
                {
                    Username = user.Username,
                    Email = user.Email
                },
                Token = token
            };
        }

        public string HashPassword(string password)
        {
            // Automatically generates a random salt and combines it with hash
            return _passwordHasher.HashPassword(null, password);
        }

        public bool VerifyPassword(string hashedPassword, string password)
        {
            var result = _passwordHasher.VerifyHashedPassword(null, hashedPassword, password);
            return result == PasswordVerificationResult.Success;
        }

        public string GenerateToken(int userId, string username)
        {
            var jwtConfig = _config.GetSection("Jwt");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtConfig["Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: jwtConfig["Issuer"],
                audience: jwtConfig["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(Convert.ToDouble(jwtConfig["ExpireMinutes"])),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}