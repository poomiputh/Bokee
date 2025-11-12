namespace Data.DTOs
{
    public class PaginationDto<T>
    {
        public List<T> Data { get; set; } = new List<T>();
        public int? CurrentPage { get; set; }
        public int? LastPage { get; set; }
    }
}