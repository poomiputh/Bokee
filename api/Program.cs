using System.IO.Compression;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

var baseFolder = Path.Combine(
    Directory.GetCurrentDirectory(),
    builder.Configuration["Storage:Base"] ?? "Storage");
var bookFolder = builder.Configuration["Storage:Book"] ?? "Book";
var bookPath = Path.Combine(baseFolder, bookFolder);
Directory.CreateDirectory(bookPath);

var dbFilePath = Path.Combine("./Data", "book.db");

// ========== Extract book ==========

// Delete database and book files if in development
// if (builder.Environment.IsDevelopment())
// {
//     if (File.Exists(dbFilePath))
//     {
//         File.Delete(dbFilePath);
//     }

//     if (Directory.Exists(bookPath))
//     {
//         Directory.Delete(bookPath, recursive: true);
//         Directory.CreateDirectory(bookPath);
//     }
// }

// ========== Extract book ==========

builder.Services.AddDbContext<ApiDbContext>(opt => opt.UseSqlite($"Data Source={dbFilePath}"));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApiDocument(config =>
{
    config.DocumentName = "BookAPI";
    config.Title = "BookAPI v1";
    config.Version = "v1";
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseCors("AllowAll");

// Ensure DB is created
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApiDbContext>();
    db.Database.EnsureCreated();
}

if (app.Environment.IsDevelopment())
{
    app.UseOpenApi();
    app.UseSwaggerUi(config =>
    {
        config.DocumentTitle = "BookAPI";
        config.Path = "/swagger";
        config.DocumentPath = "/swagger/{documentName}/swagger.json";
        config.DocExpansion = "list";
    });
}

// ========== Extract book ==========

async Task<List<Book>> AddBooksFromFolderWithZipsAsync(string folderPath, ApiDbContext dbContext)
{
    if (string.IsNullOrWhiteSpace(folderPath) || !Directory.Exists(folderPath))
        throw new DirectoryNotFoundException("Folder path is invalid or does not exist.");

    var zipFiles = Directory.GetFiles(folderPath, "*.zip", SearchOption.AllDirectories)
        .OrderBy(f => f)
        .ToList();

    if (!zipFiles.Any())
        throw new InvalidOperationException("No ZIP files found in the folder.");

    var addedBooks = new List<Book>();

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

            await dbContext.Books.AddAsync(book);
            await dbContext.SaveChangesAsync();
            addedBooks.Add(book);
        }
        catch
        {
            if (Directory.Exists(extractFolder))
                Directory.Delete(extractFolder, recursive: true);

            throw;
        }
    }

    return addedBooks;
}

// try
// {
//     var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "InitialStorage", "Book");

//     // dbContext can be resolved from DI
//     using var scope = app.Services.CreateScope();
//     var dbContext = scope.ServiceProvider.GetRequiredService<ApiDbContext>();

//     var books = await AddBooksFromFolderWithZipsAsync(folderPath, dbContext);
//     Console.WriteLine($"Added {books.Count} books from ZIP files.");
// }
// catch (Exception ex)
// {
//     Console.Error.WriteLine(ex.Message);
// }

// try
// {
//     using var scope = app.Services.CreateScope();
//     var dbContext = scope.ServiceProvider.GetRequiredService<ApiDbContext>();

//     int count = 0;
//     List<Book> pData = new();

//     while (count < 1000)
//     {
//         var pRow = new Book
//         {
//             StorageGuid = Guid.NewGuid(),
//             Title = $"Placeholder {count + 1}",
//             TotalPages = 40,
//         };

//         pData.Add(pRow);
//         count++;
//     }

//     await dbContext.AddRangeAsync(pData);
//     await dbContext.SaveChangesAsync();

// }
// catch (Exception ex)
// {
//     Console.Error.WriteLine($"Error: {ex.Message}");
// }

// ========== Extract book ==========

// GET
app.MapGet("/Get/Book/AllInfo", async (ApiDbContext dbContext, int? page, int? pageSize) =>
{
    var query = dbContext.Books
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

    var bookCount = await dbContext.Books.CountAsync();
    int? lastPage = null;
    if (pageSize.HasValue && pageSize.Value > 0)
    {
        lastPage = (int)Math.Ceiling(bookCount / (double)pageSize.Value);
    }

    return Results.Ok(new PaginationDto<BookDto>
    {
        Data = result,
        CurrentPage = page,
        LastPage = lastPage,
    });
});

app.MapGet("/Get/Book/{id}", async (ApiDbContext dbContext, int id) =>
{
    Console.WriteLine($"Requested book id: {id}");
    var result = await dbContext.Books.FindAsync(id);
    if (result == null) return Results.NotFound();
    return Results.Ok(result);
});

app.MapGet("/Get/Book/{id}/{page}", async (ApiDbContext dbContext, HttpRequest request, HttpResponse response, int id, int page) =>
{
    var book = await dbContext.Books.FindAsync(id);
    if (book == null)
        return Results.NotFound("Book not found");

    var storageGuid = book.StorageGuid;
    var supportedExts = new[] { ".jpg", ".jpeg", ".png", ".webp" };

    var foundPath = supportedExts
        .Select(ext => Path.Combine(bookPath, storageGuid.ToString(), $"{page}{ext}"))
        .FirstOrDefault(File.Exists);

    if (foundPath == null)
        return Results.NotFound($"Image not found for page {page}");

    var fileInfo = new FileInfo(foundPath);
    var provider = new FileExtensionContentTypeProvider();
    if (!provider.TryGetContentType(foundPath, out var contentType))
        contentType = "application/octet-stream";

    // Compute ETag as a hash of file content or last write time
    string eTag;
    using (var stream = File.OpenRead(foundPath))
    {
        using var md5 = MD5.Create();
        var hash = md5.ComputeHash(stream);
        eTag = Convert.ToBase64String(hash);
    }

    var lastModified = book.ModifiedDate.ToString("R"); // RFC1123

    // Check for revalidation headers
    if (request.Headers.TryGetValue("If-None-Match", out var inm) && inm == eTag)
    {
        response.Headers.ETag = eTag;
        response.Headers.LastModified = lastModified;
        return Results.StatusCode(304); // Not Modified
    }

    if (request.Headers.TryGetValue("If-Modified-Since", out var ims) &&
        DateTime.TryParse(ims, out var since) &&
        fileInfo.LastWriteTimeUtc <= since.ToUniversalTime())
    {
        response.Headers.ETag = eTag;
        response.Headers.LastModified = lastModified;
        return Results.StatusCode(304);
    }

    // Set cache headers
    response.Headers.CacheControl = "public, no-cache"; // allows ETag revalidation
    response.Headers.ETag = eTag;
    response.Headers.LastModified = lastModified;

    return Results.File(foundPath, contentType);
});

// POST
app.MapPost("/Upload/Book", async (ApiDbContext dbContext, HttpRequest request) =>
{
    if (!request.HasFormContentType)
        return Results.BadRequest("Expected form-data content type.");

    var form = await request.ReadFormAsync();
    var file = form.Files.GetFile("file");

    if (file == null || file.Length == 0)
        return Results.BadRequest("No file uploaded.");

    if (!file.FileName.EndsWith(".zip", StringComparison.OrdinalIgnoreCase))
        return Results.BadRequest("Only ZIP files are allowed.");

    var zipFileName = Path.GetFileNameWithoutExtension(file.FileName);
    var storageGuid = Guid.NewGuid();
    var extractFolder = Path.Combine(bookPath, storageGuid.ToString());
    Directory.CreateDirectory(extractFolder);

    try
    {
        await using var zipStream = file.OpenReadStream();
        using var archive = new ZipArchive(zipStream, ZipArchiveMode.Read);

        // Only files, sorted by name
        var imageEntries = archive.Entries
            .Where(e => !string.IsNullOrEmpty(e.Name))
            .OrderBy(e => e.Name)
            .ToList();

        // Validate all entries are images
        if (!imageEntries.All(e =>
            e.Name.EndsWith(".jpg", StringComparison.OrdinalIgnoreCase) ||
            e.Name.EndsWith(".jpeg", StringComparison.OrdinalIgnoreCase) ||
            e.Name.EndsWith(".png", StringComparison.OrdinalIgnoreCase) ||
            e.Name.EndsWith(".webp", StringComparison.OrdinalIgnoreCase)))
        {
            throw new InvalidOperationException("ZIP contains non-image files.");
        }

        int order = 1;
        foreach (var entry in imageEntries)
        {
            var ext = Path.GetExtension(entry.Name); // keep original extension
            var newName = $"{order}{ext}"; // sequential numbering
            var fullPath = Path.Combine(extractFolder, newName);

            Directory.CreateDirectory(Path.GetDirectoryName(fullPath)!);
            entry.ExtractToFile(fullPath, overwrite: true);
            order++;
        }

        DateTime currentUtcNow = DateTime.UtcNow;
        await dbContext.Books.AddAsync(new Book
        {
            Title = zipFileName,
            StorageGuid = storageGuid,
            TotalPages = order - 1,
            CreatedDate = currentUtcNow,
            ModifiedDate = currentUtcNow
        });
        await dbContext.SaveChangesAsync();

        return Results.Ok(new
        {
            file.FileName,
            file.Length,
            extractedTo = extractFolder,
            entries = imageEntries.Count
        });
    }
    catch (Exception ex)
    {
        if (Directory.Exists(extractFolder))
            Directory.Delete(extractFolder, recursive: true);

        Console.Error.WriteLine(ex);
        return Results.Problem("Failed to extract ZIP file. Make sure it contains only images.");
    }
});

app.Run();