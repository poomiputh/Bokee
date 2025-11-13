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
            var book = await _bookService.GetBook(bookId);
            if (book == null) return NotFound();

            var imagePath = await _bookService.GetPagePath(bookId, page);
            if (imagePath == null) return NotFound();
            var fileInfo = new FileInfo(imagePath);

            var eTag = await _bookService.ComputeImageEtag(imagePath);
            var lastModified = book.ModifiedDate.ToString("R");

            if (Request.Headers.TryGetValue("If-None-Match", out var inm) && inm == eTag)
            {
                Request.Headers.ETag = eTag;
                Request.Headers.LastModified = lastModified;
                return StatusCode(304);
            }

            if (Request.Headers.TryGetValue("If-Modified-Since", out var ims) &&
                DateTime.TryParse(ims, out var since) &&
                fileInfo.LastWriteTimeUtc <= since.ToUniversalTime())
            {
                Request.Headers.ETag = eTag;
                Request.Headers.LastModified = lastModified;
                return StatusCode(304);
            }

            Response.Headers.CacheControl = "public, no-cache";
            Response.Headers.ETag = eTag;
            Response.Headers.LastModified = lastModified;

            var result = await _bookService.GetPage(bookId, page);
            if (result == null)
                return NotFound("Page not found");

            return File(result.Value.Data, result.Value.ContentType);
        }
    }
}