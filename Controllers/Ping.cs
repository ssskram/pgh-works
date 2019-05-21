using Microsoft.AspNetCore.Mvc;

namespace pghworks.Controllers
{
    [Route("api/[controller]")]
    public class ping : Controller
    {
        [HttpGet("[action]")]
        public IActionResult pong()
        {
            bool isAuthenticated = User.Identity.IsAuthenticated;
            return Ok(isAuthenticated);
        }
    }
}