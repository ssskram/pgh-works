using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using pghworks.Models;

namespace pghworks.Controllers {
    [Authorize]
    [Route ("api/[controller]")]
    public class drawdowns : Controller {
        private readonly UserManager<ApplicationUser> _userManager;
        public drawdowns (UserManager<ApplicationUser> userManager) {
            _userManager = userManager;
        }
        HttpClient client = new HttpClient ();

        public class Drawdown {
            public string drawdownID { get; set; }
            public string parentID { get; set; }
            public string parentType { get; set; }
            public string fundID { get; set; }
            public string drawdownAmount { get; set; }
            public string drawdownType { get; set; }
            public string notes { get; set; }
            public string spID { get; set; }
        }

        // GET
        [HttpGet ("[action]")]
        public object loadDrawdowns () {
            List<Drawdown> AllDrawdowns = new List<Drawdown> ();
            string drawdowns = getDrawdowns ().Result;
            dynamic drawdownsObject = JObject.Parse (drawdowns) ["value"];
            foreach (var item in drawdownsObject) {
                Drawdown tg = new Drawdown () {
                    drawdownID = item.drawdownID,
                    parentID = item.parentID,
                    parentType = item.parentType,
                    fundID = item.fundID,
                    drawdownAmount = item.drawdownAmount,
                    drawdownType = item.drawdownType,
                    notes = item.notes,
                    spID = item.Id

                };
                AllDrawdowns.Add (tg);
            }
            return (AllDrawdowns);
        }
        public async Task<string> getDrawdowns () {
            string token = refreshtoken ().Result;
            client.DefaultRequestHeaders.Clear ();
            client.DefaultRequestHeaders.Add ("Accept", "application/json");
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue ("Bearer", token);
            string listitems = await client.GetStringAsync ("https://cityofpittsburgh.sharepoint.com/sites/pghworks/_api/web/lists/GetByTitle('drawdowns')/items");
            return listitems;
        }

        // POST
        [HttpPost ("[action]")]
        public async Task addDrawdown ([FromBody] Drawdown model) {
            string drawdownLoad = JsonConvert.SerializeObject (model);
            string token = refreshtoken ().Result;
            var sharepointUrl = "https://cityofpittsburgh.sharepoint.com/sites/pghworks/_api/web/lists/GetByTitle('drawdowns')/items";
            client.DefaultRequestHeaders.Clear ();
            client.DefaultRequestHeaders.Add ("X-HTTP-Method", "POST");
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue ("Basic", token);
            string json = "{ '__metadata': {{ 'type': 'SP.Data.drawdownsItem' }}," + drawdownLoad + "}";
            client.DefaultRequestHeaders.Add ("ContentLength", json.Length.ToString ());
            try {
                StringContent strContent = new StringContent (json);
                strContent.Headers.ContentType = MediaTypeHeaderValue.Parse ("application/json;odata=verbose");
                HttpResponseMessage response = client.PostAsync (sharepointUrl, strContent).Result;
                response.EnsureSuccessStatusCode ();
                var content = await response.Content.ReadAsStringAsync ();
            } catch (Exception ex) {
                System.Diagnostics.Debug.WriteLine (ex.Message);
            }
            await new log ().postLog (_userManager.GetUserName (HttpContext.User), "Post", "Drawdown", model.parentType, model.drawdownID);
        }

        // POST
        [HttpPut ("[action]")]
        public async Task updateDrawdown ([FromBody] Drawdown model) {
            string drawdownLoad = JsonConvert.SerializeObject (model);
            string token = refreshtoken ().Result;
            var sharepointUrl = string.Format("https://cityofpittsburgh.sharepoint.com/sites/pghworks/_api/web/lists/GetByTitle('drawdowns')/items({0})", model.spID);
            client.DefaultRequestHeaders.Clear ();
            client.DefaultRequestHeaders.Add ("Accept", "application/json;odata=verbose");
            client.DefaultRequestHeaders.Add ("X-RequestDigest", "form digest value");
            client.DefaultRequestHeaders.Add ("X-HTTP-Method", "MERGE");
            client.DefaultRequestHeaders.Add ("IF-MATCH", "*");
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue ("Basic", token);
            string json = "{ '__metadata': {{ 'type': 'SP.Data.drawdownsItem' }}," + drawdownLoad + "}";
            client.DefaultRequestHeaders.Add ("ContentLength", json.Length.ToString ());
            try {
                StringContent strContent = new StringContent (json);
                strContent.Headers.ContentType = MediaTypeHeaderValue.Parse ("application/json;odata=verbose");
                HttpResponseMessage response = client.PostAsync (sharepointUrl, strContent).Result;
                response.EnsureSuccessStatusCode ();
                var content = await response.Content.ReadAsStringAsync ();
            } catch (Exception ex) {
                System.Diagnostics.Debug.WriteLine (ex.Message);
            }
            await new log ().postLog (_userManager.GetUserName (HttpContext.User), "Put", "Drawdown", model.parentType, model.drawdownID);
        }

        private async Task<string> refreshtoken () {
            var MSurl = "https://accounts.accesscontrol.windows.net/f5f47917-c904-4368-9120-d327cf175591/tokens/OAuth/2";
            var clientid = Environment.GetEnvironmentVariable ("SPClientID");
            var clientsecret = Environment.GetEnvironmentVariable ("SPClientSecret");
            var refreshtoken = Environment.GetEnvironmentVariable ("refreshtoken");
            var redirecturi = Environment.GetEnvironmentVariable ("redirecturi");
            var SPresource = Environment.GetEnvironmentVariable ("spresourceid");
            client.DefaultRequestHeaders.Clear ();
            client.DefaultRequestHeaders.Add ("Accept", "application/x-www-form-urlencoded");
            client.DefaultRequestHeaders.Add ("X-HTTP-Method", "POST");

            var json =
                String.Format ("grant_type=refresh_token&client_id={0}&client_secret={1}&refresh_token={2}&redirect_uri={3}&resource={4}",
                    clientid, // 0
                    clientsecret, // 1
                    refreshtoken, // 2
                    redirecturi, // 3
                    SPresource); // 4

            client.DefaultRequestHeaders.Add ("ContentLength", json.Length.ToString ());
            StringContent strContent = new StringContent (json);
            strContent.Headers.ContentType = MediaTypeHeaderValue.Parse ("application/x-www-form-urlencoded");
            HttpResponseMessage response = client.PostAsync (MSurl, strContent).Result;
            response.EnsureSuccessStatusCode ();
            var content = await response.Content.ReadAsStringAsync ();
            dynamic results = JsonConvert.DeserializeObject<dynamic> (content);
            string token = results.access_token.ToString ();
            return token;
        }

    }
}