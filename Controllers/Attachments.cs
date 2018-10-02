using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using pghworks.Models;

namespace pghworks.Controllers {
    [Authorize]
    [Route ("api/[controller]")]
    public class attachments : Controller {
        HttpClient client = new HttpClient ();

        // GET
        [HttpGet ("[action]")]
        public async Task<bool> loadAttachments () {
            bool bl = true;
            await Task.Delay (1);
            return bl;
        }

    }
}