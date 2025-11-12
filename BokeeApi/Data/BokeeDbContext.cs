using Data.Models.Book;
using Microsoft.EntityFrameworkCore;

namespace Data
{
    public class BokeeDbContext : DbContext
    {
        public BokeeDbContext(DbContextOptions<BokeeDbContext> options)
            : base(options) { }

        public DbSet<Book> Books => Set<Book>();
    }
}