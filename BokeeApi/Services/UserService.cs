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
    public class UserService : IUserService
    {
        private readonly BokeeDbContext _dbContext;
        private readonly IConfiguration _config;

        public UserService(BokeeDbContext dbContext, IConfiguration config)
        {
            _dbContext = dbContext;
            _config = config;
        }

        public async Task<bool> CreateSavedBook(int userId, int bookId, int categoryId)
        {
            bool isExist = await _dbContext.SavedBooks
                .AnyAsync(sb => sb.UserId == userId && sb.BookId == bookId && sb.CategoryId == categoryId);
            if (isExist) return true;

            SavedBook savedBook = new SavedBook
            {
                UserId = userId,
                BookId = bookId,
                CategoryId = categoryId,
                CreatedDate = DateTime.UtcNow
            };

            await _dbContext.SavedBooks.AddAsync(savedBook);
            await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteSavedBook(int userId, int bookId, int categoryId)
        {
            SavedBook? savedBook = await _dbContext.SavedBooks
                .Where(sb => sb.UserId == userId && sb.BookId == bookId && sb.CategoryId == categoryId)
                .FirstOrDefaultAsync();
            if (savedBook == null) return false;

            _dbContext.SavedBooks.Remove(savedBook);
            await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> SetBookProgress(int userId, int bookId, int page)
        {
            bool userExists = await _dbContext.Users.AnyAsync(u => u.Id == userId);
            if (!userExists) return false;

            bool bookExists = await _dbContext.Books.AnyAsync(u => u.Id == bookId);
            if (!bookExists) return false;

            BookProgress? bookProgress = await _dbContext.BookProgresses
                .Where(bp => bp.UserId == userId && bp.BookId == bookId)
                .FirstOrDefaultAsync();

            DateTime utcNow = DateTime.UtcNow;

            if (bookProgress != null)
            {
                int maxReachedPage = page > bookProgress.MaxReachedPage ? page : bookProgress.MaxReachedPage;
                bookProgress.CurrentPage = page;
                bookProgress.MaxReachedPage = maxReachedPage;
                bookProgress.ModifiedDate = utcNow;
                await _dbContext.SaveChangesAsync();
                return true;
            }

            BookProgress newBookProgress = new BookProgress
            {
                UserId = userId,
                BookId = bookId,
                CurrentPage = page,
                MaxReachedPage = page,
                CreatedDate = utcNow,
                ModifiedDate = utcNow
            };

            await _dbContext.BookProgresses.AddAsync(newBookProgress);
            await _dbContext.SaveChangesAsync();
            return true;
        }
    }
}