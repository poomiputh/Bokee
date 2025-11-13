using Data.Models;
using Microsoft.EntityFrameworkCore;

namespace Data
{
    public class BokeeDbContext : DbContext
    {
        public BokeeDbContext(DbContextOptions<BokeeDbContext> options)
            : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<Book> Books => Set<Book>();
        public DbSet<BookProgress> BookProgresses => Set<BookProgress>();
        public DbSet<SavedBook> SavedBooks => Set<SavedBook>();
    }
}