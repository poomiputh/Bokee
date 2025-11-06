using Microsoft.EntityFrameworkCore;

class ApiDbContext : DbContext
{
    public ApiDbContext(DbContextOptions<ApiDbContext> options)
        : base(options) { }

    public DbSet<Book> Books => Set<Book>();
}