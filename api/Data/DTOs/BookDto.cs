public class BookDto
{
    public int Id { get; set; }
    public Guid? StorageGuid { get; set; }
    public required string Title { get; set; }
    public string? Description { get; set; }
    public int TotalPages { get; set; }
}