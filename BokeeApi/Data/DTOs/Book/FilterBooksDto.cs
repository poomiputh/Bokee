namespace Data.DTOs.Book
{
    public class FilterBooksDto
    {
        public int? Page { get; set; }
        public int? PageSize { get; set; }
        public string? Title { get; set; }
        public bool? Random { get; set; }
    }
}