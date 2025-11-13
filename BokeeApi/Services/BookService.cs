using System.IO.Compression;
using System.Security.Cryptography;
using Data;
using Data.DTOs;
using Data.DTOs.Book;
using Data.Models.Book;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;
using Services.Interfaces;

namespace Services
{
    public class BookService(
        BokeeDbContext dbContext,
        IConfiguration config,
        ILogger logger,
        IWebHostEnvironment env
    ) : IBookService
    {
        private readonly BokeeDbContext _dbContext = dbContext;
        private readonly IConfiguration _config = config;
        private readonly ILogger _logger = logger;
        private readonly string _wwwRootPath = env.WebRootPath;

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
            var bookPath = Path.Combine(_wwwRootPath, storageBasePath, storageBookPath);

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

            // // Compute ETag as a hash of file content or last write time
            // string eTag;
            // using (var stream = File.OpenRead(foundPath))
            // {
            //     using var md5 = MD5.Create();
            //     var hash = md5.ComputeHash(stream);
            //     eTag = Convert.ToBase64String(hash);
            // }

            // var lastModified = book.ModifiedDate.ToString("R"); // RFC1123

            // // Check for revalidation headers
            // if (request.Headers.TryGetValue("If-None-Match", out var inm) && inm == eTag)
            // {
            //     response.Headers.ETag = eTag;
            //     response.Headers.LastModified = lastModified;
            //     return Results.StatusCode(304); // Not Modified
            // }

            // if (request.Headers.TryGetValue("If-Modified-Since", out var ims) &&
            //     DateTime.TryParse(ims, out var since) &&
            //     fileInfo.LastWriteTimeUtc <= since.ToUniversalTime())
            // {
            //     response.Headers.ETag = eTag;
            //     response.Headers.LastModified = lastModified;
            //     return Results.StatusCode(304);
            // }

            // // Set cache headers
            // response.Headers.CacheControl = "public, no-cache"; // allows ETag revalidation
            // response.Headers.ETag = eTag;
            // response.Headers.LastModified = lastModified;

            var fileBytes = await File.ReadAllBytesAsync(foundPath);

            return (fileBytes, contentType);
        }

        public async Task<string?> GetPagePath(int bookId, int page)
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
            var bookPath = Path.Combine(_wwwRootPath, storageBasePath, storageBookPath);

            var foundPath = supportedExts
                .Select(ext => Path.Combine(bookPath, storageGuid.ToString(), $"{page}{ext}"))
                .FirstOrDefault(File.Exists);

            return foundPath;
        }

        public async Task AddBooks(string folderPath)
        {
            if (string.IsNullOrWhiteSpace(folderPath) || !Directory.Exists(folderPath))
                throw new DirectoryNotFoundException("Folder path is invalid or does not exist.");

            var zipFiles = Directory.GetFiles(folderPath, "*.zip", SearchOption.AllDirectories)
                .OrderBy(f => f)
                .ToList();

            if (!zipFiles.Any())
                throw new InvalidOperationException("No ZIP files found in the folder.");

            var addedBooks = new List<Book>();

            var storageBasePath = _config["Storage:Base"];
            var storageBookPath = _config["Storage:Book"];
            if (storageBasePath == null || storageBookPath == null)
            {
                throw new DirectoryNotFoundException("Invalid book storage path.");
            }
            var bookPath = Path.Combine(_wwwRootPath, storageBasePath, storageBookPath);

            foreach (var zipPath in zipFiles)
            {
                var zipFileName = Path.GetFileNameWithoutExtension(zipPath);
                var storageGuid = Guid.NewGuid();
                var extractFolder = Path.Combine(bookPath, storageGuid.ToString());
                Directory.CreateDirectory(extractFolder);

                try
                {
                    using var archive = new ZipArchive(File.OpenRead(zipPath), ZipArchiveMode.Read);

                    var imageEntries = archive.Entries
                        .Where(e => !string.IsNullOrEmpty(e.Name))
                        .OrderBy(e => e.Name)
                        .ToList();

                    if (!imageEntries.All(e =>
                        e.Name.EndsWith(".jpg", StringComparison.OrdinalIgnoreCase) ||
                        e.Name.EndsWith(".jpeg", StringComparison.OrdinalIgnoreCase) ||
                        e.Name.EndsWith(".png", StringComparison.OrdinalIgnoreCase) ||
                        e.Name.EndsWith(".gif", StringComparison.OrdinalIgnoreCase) ||
                        e.Name.EndsWith(".webp", StringComparison.OrdinalIgnoreCase)))
                    {
                        string errorMessage = $"ZIP '{zipPath}' contains non-image files.";
                        // throw new InvalidOperationException(errorMessage);
                        Console.WriteLine(errorMessage);
                        continue;
                    }

                    int order = 1;
                    foreach (var entry in imageEntries)
                    {
                        var ext = Path.GetExtension(entry.Name);
                        var newName = $"{order}{ext}";
                        var fullPath = Path.Combine(extractFolder, newName);

                        Directory.CreateDirectory(Path.GetDirectoryName(fullPath)!);
                        entry.ExtractToFile(fullPath, overwrite: true);
                        order++;
                    }

                    DateTime currentUtcNow = DateTime.UtcNow;
                    var book = new Book
                    {
                        Title = zipFileName,
                        StorageGuid = storageGuid,
                        TotalPages = order - 1,
                        CreatedDate = currentUtcNow,
                        ModifiedDate = currentUtcNow
                    };

                    await _dbContext.Books.AddAsync(book);
                    await _dbContext.SaveChangesAsync();
                    addedBooks.Add(book);
                }
                catch
                {
                    if (Directory.Exists(extractFolder))
                        Directory.Delete(extractFolder, recursive: true);

                    throw;
                }
            }
        }

        public async Task<string> ComputeImageEtag(string imagePath)
        {
            return "";
        }
    }
}