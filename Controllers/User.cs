using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using pghworks.Models;

namespace pghworks.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class userdata : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        public userdata(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        [HttpGet("[action]")]
        public IActionResult getuser()
        {
            var user = _userManager.GetUserName(HttpContext.User);
            return Json(user);
        }
    }
}