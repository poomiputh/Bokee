using Data;
using Data.DTOs;
using Data.DTOs.Book;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;
using Services.Interfaces;

namespace Services
{
    public class BookService(
        BokeeDbContext dbContext,
        IConfiguration config,
        ILogger logger
    ) : IBookService
    {
        private readonly BokeeDbContext _dbContext = dbContext;
        private readonly IConfiguration _config = config;
        private readonly ILogger _logger = logger;

        public async Task<PaginationDto<BookDto>> GetBooks(int? page, int? pageSize)
        {
            var query = _dbContext.Books
                .OrderBy(b => b.Id)
                .Select(b => new BookDto
                {
                    Id = b.Id,
                    Title = b.Title,
                    StorageGuid = b.StorageGuid,
                    Description = b.Description,
                    TotalPages = b.TotalPages
                });

            if (page != null && pageSize != null)
            {
                query = query
                    .Skip(((int)page - 1) * (int)pageSize)
                    .Take((int)pageSize);
            }

            var result = await query.ToListAsync();

            var bookCount = await _dbContext.Books.CountAsync();
            int? lastPage = null;
            if (pageSize.HasValue && pageSize.Value > 0)
            {
                lastPage = (int)Math.Ceiling(bookCount / (double)pageSize.Value);
            }

            return new PaginationDto<BookDto>
            {
                Data = result,
                CurrentPage = page,
                LastPage = lastPage,
            };
        }

        public async Task<BookDto?> GetBook(int bookId)
        {
            var result = await _dbContext.Books.FindAsync(bookId);
            if (result == null) return null;
            return new BookDto
            {
                Id = result.Id,
                Title = result.Title,
                StorageGuid = result.StorageGuid,
                Description = result.Description,
                TotalPages = result.TotalPages
            };
        }

        public async Task<(byte[] Data, string ContentType)?> GetPage(int bookId, int page)
        {
            var book = await _dbContext.Books.FindAsync(bookId);
            if (book == null) return null;

            var storageGuid = book.StorageGuid;
            var supportedExts = new[] { ".jpg", ".jpeg", ".png", ".webp" };

            var storageBasePath = _config["Storage:Base"];
            var storageBookPath = _config["Storage:Book"];
            if (storageBasePath == null || storageBookPath == null)
            {
                _logger.LogError("Invalid book storage path.");
                return null;
            }
            var bookPath = Path.Combine(storageBasePath, storageBookPath);

            var foundPath = supportedExts
                .Select(ext => Path.Combine(bookPath, storageGuid.ToString(), $"{page}{ext}"))
                .FirstOrDefault(File.Exists);

            if (foundPath == null)
            {
                _logger.LogError($"Image not found for page {page}");
                return null;
            }

            var fileInfo = new FileInfo(foundPath);
            var provider = new FileExtensionContentTypeProvider();
            if (!provider.TryGetContentType(foundPath, out var contentType))
                contentType = "application/octet-stream";

            var fileBytes = await File.ReadAllBytesAsync(foundPath);

            return (fileBytes, contentType);
        }
    }
}