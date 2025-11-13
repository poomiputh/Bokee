using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;

namespace Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private readonly IBookService _bookService;

        public BookController(IBookService bookService)
        {
            _bookService = bookService;
        }

        [HttpGet]
        public async Task<IActionResult> GetBooks([FromQuery] int? page, [FromQuery] int? pageSize)
        {
            var result = await _bookService.GetBooks(page, pageSize);
            return Ok(result);
        }

        [HttpGet("{bookId}")]
        public async Task<IActionResult> GetBook(int bookId)
        {
            var result = await _bookService.GetBook(bookId);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpGet("{bookId}/{page}")]
        public async Task<IActionResult> GetPage(int bookId, int page)
        {
            var result = await _bookService.GetPage(bookId, page);
            if (result == null)
                return NotFound("Page not found");

            return File(result.Value.Data, result.Value.ContentType);
        }
    }
}