namespace Data.Models
{
    public class BookProgress
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int BookId { get; set; }
        public int CurrentPage { get; set; }
        public int MaxReachedPage { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ModifiedDate { get; set; }

        public virtual User User { get; set; } = default!;
        public virtual Book Book { get; set; } = default!;
    }
}