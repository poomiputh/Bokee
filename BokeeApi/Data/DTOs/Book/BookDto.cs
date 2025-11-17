namespace Data.DTOs.Book
{
    public class BookDto
    {
        public int Id { get; set; }
        public Guid? StorageGuid { get; set; }
        public required string Title { get; set; }
        public string? Description { get; set; }
        public int TotalPages { get; set; }
        public int? CurrentPage { get; set; }
        public int? SavedId { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}