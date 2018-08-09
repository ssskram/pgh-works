using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using System.Net.Http;
using SendGrid;
using SendGrid.Helpers.Mail;
using pghworks.Models;

namespace pghworks.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class survey : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        public survey(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        HttpClient client = new HttpClient();

        [HttpPost("[action]")]
        public async Task post([FromBody] Survey model)
        {
            var submittedby = _userManager.GetUserName(HttpContext.User);
            var apiKey = Environment.GetEnvironmentVariable("sendgrid");
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress(submittedby, "PGH SPA Redux");
            var subject = "Feedback from PGH SPA Redux";
            var to = new EmailAddress("paul.marks@pittsburghpa.gov", "Paul Marks");
            var plainTextContent =
                String.Format
                ("<strong> Feedback from pgh spa redux. </strong><br><br><strong> Email: </strong><br> {0} <br><br><strong> Name: </strong><br> {1} <br><br><strong> Department: </strong><br> {2} <br><br><strong> Thoughts: </strong><br> {3} <br><br><strong> Willing participant for future user testing: </strong><br> {4} <br><br><strong> This message was automatically generated by the system.  Do not reply.</strong>",
                    submittedby, // 0
                    model.name, // 1
                    model.department, // 2
                    model.body, // 3
                    model.futureUserTesting); // 4
            var htmlContent =
                String.Format
                ("<strong> Feedback from pgh spa redux. </strong><br><br><strong> Email: </strong><br> {0} <br><br><strong> Name: </strong><br> {1} <br><br><strong> Department: </strong><br> {2} <br><br><strong> Thoughts: </strong><br> {3} <br><br><strong> Willing participant for future user testing: </strong><br> {4} <br><br><strong> This message was automatically generated by the system.  Do not reply.</strong>",
                    submittedby, // 0
                    model.name, // 1
                    model.department, // 2
                    model.body, // 3
                    model.futureUserTesting); // 4
            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
            var response = await client.SendEmailAsync(msg);
        }
    }
}
