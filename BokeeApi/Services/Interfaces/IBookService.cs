using Data.DTOs;
using Data.DTOs.Book;

namespace Services.Interfaces
{
    public interface IBookService
    {
        public Task<PaginationDto<BookDto>> GetBooks(int? page, int? pageSize);
        public Task<BookDto?> GetBook(int bookId);
        public Task<(byte[] Data, string ContentType)?> GetPage(int bookId, int page);
        public Task AddBooks(string folderPath);
    }
}