namespace Data.Models
{
    public class Book
    {
        public int Id { get; set; }
        public Guid StorageGuid { get; set; }
        public required string SourcePath { get; set; }
        public required string Title { get; set; }
        public string? Description { get; set; }
        public int TotalPages { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ModifiedDate { get; set; }

        public virtual ICollection<BookProgress> UserBookProgresses { get; set; } = default!;
        public virtual ICollection<SavedBook> UserSavedBooks { get; set; } = default!;
    }
}
