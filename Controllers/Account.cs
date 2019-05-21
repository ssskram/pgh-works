using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using pghworks.Models;

namespace pghworks.Controllers
{
    [Authorize]
    [Route("[controller]/[action]")]
    public class Account : Controller
    {
        HttpClient client = new HttpClient();

        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;

        public Account(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> Login()
        {
            // Clear the existing external cookie to ensure a clean login process
            await _signInManager.SignOutAsync();
            await HttpContext.SignOutAsync(IdentityConstants.ExternalScheme);
            return View();
        }

        [HttpPost]
        [AllowAnonymous]
        public IActionResult ExternalLogin(string provider, string returnUrl = null)
        {
            // Request a redirect to the external login provider.
            var redirectUrl = Url.Action(nameof(ExternalLoginCallback), "Account", new { returnUrl });
            var properties = _signInManager.ConfigureExternalAuthenticationProperties(provider, redirectUrl);
            return Challenge(properties, provider);
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> ExternalLoginCallback(string returnUrl = null, string remoteError = null)
        {
            var info = await _signInManager.GetExternalLoginInfoAsync();
            // create user account, and log user in.
            var email = info.Principal.FindFirstValue(ClaimTypes.Email);
            if (email.Contains("@pittsburghpa.gov"))
            {
                var user = new ApplicationUser { UserName = email, Email = email };
                var add = await _userManager.CreateAsync(user);
                if (add.Succeeded)
                {
                    add = await _userManager.AddLoginAsync(user, info);
                    if (add.Succeeded)
                    {
                        await _signInManager.ExternalLoginSignInAsync(info.LoginProvider, info.ProviderKey, isPersistent: true, bypassTwoFactor: true);
                    }
                }
                return RedirectToAction(nameof(Home.Index), "Home");
            }
            else
            {
                return View("AccessDenied");
            }
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return RedirectToAction(nameof(Home.Index), "Home");
        }

        public async Task<IActionResult> AccessDenied()
        {
            await HttpContext.SignOutAsync(IdentityConstants.ExternalScheme);
            return View();
        }
    }
}