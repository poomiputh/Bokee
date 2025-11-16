using System.Text;
using Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Services;
using Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<BokeeDbContext>(options =>
{
    string connectionString = builder.Configuration.GetConnectionString("DefaultConnection")!;
    options.UseSqlServer(connectionString);
});


#region JWT
var jwtConfig = builder.Configuration.GetSection("Jwt");
var key = Encoding.UTF8.GetBytes(jwtConfig["Key"]);

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtConfig["Issuer"],
            ValidAudience = jwtConfig["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(key)
        };
    });

builder.Services.AddAuthorization();
#endregion

builder.Services.AddControllers();

builder.Services.AddScoped<ILogger, Logger<IBookService>>();
builder.Services.AddScoped<IAccountService, AccountService>();
builder.Services.AddScoped<IBookService, BookService>();
builder.Services.AddScoped<IUserService, UserService>();


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

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// try
// {
//     using var scope = app.Services.CreateScope();
//     var dbContext = scope.ServiceProvider.GetRequiredService<BokeeDbContext>();
//     var config = scope.ServiceProvider.GetRequiredService<IConfiguration>();
//     var env = scope.ServiceProvider.GetRequiredService<IWebHostEnvironment>();
//     var bookService = scope.ServiceProvider.GetRequiredService<IBookService>();

//     dbContext.BookProgresses.RemoveRange(dbContext.BookProgresses);
//     dbContext.SavedBooks.RemoveRange(dbContext.SavedBooks);
//     dbContext.Books.RemoveRange(dbContext.Books);
//     dbContext.Users.RemoveRange(dbContext.Users);

//     await dbContext.SaveChangesAsync();

//     var storageBasePath = config["Storage:Base"];
//     var storageBookPath = config["Storage:Book"];
//     if (storageBasePath == null || storageBookPath == null)
//     {
//         throw new DirectoryNotFoundException("Invalid book storage path.");
//     }

//     var bookPath = Path.Combine(env.WebRootPath, storageBasePath, storageBookPath);
//     var seedBookPath = Path.Combine(env.WebRootPath, "SeedStorage", "Book");

//     if (Directory.Exists(bookPath))
//     {
//         Directory.Delete(bookPath, recursive: true);
//     }

//     await bookService.AddBooks(@"E:\Media\Horny\Horny_Read\Random");
// }
// catch (Exception ex)
// {
//     Console.WriteLine(ex.Message);
// }

app.UseCors("AllowAll");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers().RequireAuthorization(); ;

app.Run();
