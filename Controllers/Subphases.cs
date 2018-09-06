using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using pghworks.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace pghworks.Controllers {
    [Authorize]
    [Route ("api/[controller]")]
    public class subphases : Controller {
        HttpClient client = new HttpClient ();

        // GET
        [HttpGet ("[action]")]
        public async Task<bool> loadSubphases () {
            bool bl = true;
            await Task.Delay(1);
            return bl;
        }

    }
}