using Data;
using Microsoft.EntityFrameworkCore;
using Services;
using Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<BokeeDbContext>(options =>
{
    string connectionString = builder.Configuration.GetConnectionString("DefaultConnection")!;
    options.UseSqlServer(connectionString);
});

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddTransient<ILogger, Logger<IBookService>>();
builder.Services.AddTransient<IBookService, BookService>();

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
//     var env = scope.ServiceProvider.GetRequiredService<IWebHostEnvironment>();
//     var bookService = scope.ServiceProvider.GetRequiredService<IBookService>();
//     var seedBookPath = Path.Combine(env.WebRootPath, "SeedStorage", "Book");
//     await bookService.AddBooks(seedBookPath);
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

app.UseAuthorization();

app.MapControllers();

app.Run();
