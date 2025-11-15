
using Microsoft.EntityFrameworkCore;

namespace Data.Models
{
    [Index(nameof(UserId), nameof(BookId), nameof(CategoryId), IsUnique = true)]
    public class SavedBook
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int BookId { get; set; }
        public int CategoryId { get; set; }
        public DateTime CreatedDate { get; set; }

        public virtual User User { get; set; } = default!;
        public virtual Book Book { get; set; } = default!;
    }
}