using Microsoft.EntityFrameworkCore;

namespace Data.Models
{
    [Index(nameof(Username), IsUnique = true)]
    [Index(nameof(Email), IsUnique = true)]
    public class User
    {
        public int Id { get; set; }
        public required string Username { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ModifiedDate { get; set; }

        public virtual ICollection<BookProgress> UserBookProgresses { get; set; } = default!;
        public virtual ICollection<SavedBook> UserSavedBooks { get; set; } = default!;
    }
}