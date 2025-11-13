using DTOs.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;

namespace Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IAccountService _accountService;

        public AccountController(IAccountService accountService)
        {
            _accountService = accountService;
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> RegisterUser(RegisterUserDto userData)
        {
            var result = await _accountService.RegisterUser(userData);
            if (result == null) return BadRequest();
            return Ok(result);
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> LoginUser(LoginUserDto userData)
        {
            var result = await _accountService.LoginUser(userData);
            if (result == null) return NotFound();
            return Ok(result);
        }
    }
}