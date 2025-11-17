using System.Security.Claims;
using DTOs.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;

namespace Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateSavedBook([FromBody] CreateSavedBookDto createData)
        {
            int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");
            if (userId == 0) return Unauthorized();

            var result = await _userService.CreateSavedBook(userId, createData.BookId, createData.CategoryId);
            if (result == false) return BadRequest();
            return Ok();
        }

        [HttpDelete("{bookId}/{categoryId}")]
        public async Task<IActionResult> DeleteSavedBook([FromRoute] int bookId, [FromRoute] int categoryId)
        {
            int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");
            if (userId == 0) return Unauthorized();

            var result = await _userService.DeleteSavedBook(userId, bookId, categoryId);
            if (result == false) return BadRequest();
            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> SetBookProgress([FromBody] SetBookProgressDto progressData)
        {
            int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");
            if (userId == 0) return Unauthorized();

            var result = await _userService.SetBookProgress(userId, progressData.BookId, progressData.Page);
            if (result == false) return BadRequest();
            return Ok();
        }
    }
}