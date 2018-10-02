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

        // GET
        [HttpGet ("[action]")]
        public object loadDrawdowns () {
            List<Drawdown> AllDrawdowns = new List<Drawdown> ();
            string drawdowns = getDrawdowns ().Result;
            dynamic drawdownsObject = JObject.Parse (drawdowns) ["projectFundDrawdownsClass"];
            foreach (var item in drawdownsObject) {
                Drawdown tg = new Drawdown () {
                    drawdownID = item.drawdownIDField,
                    parentID = item.parentIDField,
                    parentType = item.parentTypeField,
                    fundID = item.fundIDField,
                    drawdownAmount = item.drawdownAmountField,
                    drawdownType = item.drawdownTypeField,
                    notes = item.notesField,
                    cartegraphID = item.Oid
                };
                AllDrawdowns.Add (tg);
            }
            return (AllDrawdowns);
        }
        public async Task<string> getDrawdowns () {
            var key = Environment.GetEnvironmentVariable ("CartegraphAPIkey");
            var cartegraphUrl = "https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/classes/projectFundDrawdownsClass";
            client.DefaultRequestHeaders.Clear ();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue ("Basic", key);
            string content = await client.GetStringAsync (cartegraphUrl);
            return content;
        }

        // POST
        [HttpPost ("[action]")]
        public async Task addDrawdown ([FromBody] Drawdown model) {
            CgDrawdown cgModel = new CgDrawdown () {
                drawdownIDField = model.drawdownID,
                parentIDField = model.parentID,
                parentTypeField = model.parentType,
                fundIDField = model.fundID,
                drawdownAmountField = model.drawdownAmount,
                drawdownTypeField = model.drawdownType,
                notesField = model.notes,
                Oid = model.cartegraphID
            };
            string cgLoad = JsonConvert.SerializeObject (cgModel);
            var key = Environment.GetEnvironmentVariable ("CartegraphAPIkey");
            var cartegraphUrl = "https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/Classes/projectFundDrawdownsClass";
            client.DefaultRequestHeaders.Clear ();
            client.DefaultRequestHeaders.Add ("X-HTTP-Method", "POST");
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue ("Basic", key);
            string json = "{ 'projectFundDrawdownsClass' : [" + cgLoad + "] }";
            client.DefaultRequestHeaders.Add ("ContentLength", json.Length.ToString ());
            try {
                StringContent strContent = new StringContent (json);
                strContent.Headers.ContentType = MediaTypeHeaderValue.Parse ("application/json;odata=verbose");
                HttpResponseMessage response = client.PostAsync (cartegraphUrl, strContent).Result;
                response.EnsureSuccessStatusCode ();
                var content = await response.Content.ReadAsStringAsync ();
            } catch (Exception ex) {
                System.Diagnostics.Debug.WriteLine (ex.Message);
            }
            await new log ().postLog (_userManager.GetUserName (HttpContext.User), "Post", "Drawdown", model.parentType, model.drawdownID);
        }

        // PUT
        [HttpPut ("[action]")]
        public async Task updateDrawdown ([FromBody] Drawdown model) {
            var key = Environment.GetEnvironmentVariable ("CartegraphAPIkey");
            string id;
            if (model.cartegraphID != null && model.cartegraphID != "") {
                id = model.cartegraphID;
            } else {
                var getURL =
                    String.Format ("https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/classes/projectFundDrawdownsClass?filter=(([drawdownID] is equal to \"{0}\"))",
                        model.drawdownID); // 0
                client.DefaultRequestHeaders.Clear ();
                client.DefaultRequestHeaders.Authorization =
                    new AuthenticationHeaderValue ("Basic", key);
                string content = await client.GetStringAsync (getURL);
                dynamic milestone = JObject.Parse (content) ["projectFundDrawdownsClass"][0];
                id = milestone.Oid;
            }
            CgDrawdown cgModel = new CgDrawdown () {
                drawdownIDField = model.drawdownID,
                parentIDField = model.parentID,
                parentTypeField = model.parentType,
                fundIDField = model.fundID,
                drawdownAmountField = model.drawdownAmount,
                drawdownTypeField = model.drawdownType,
                notesField = model.notes,
                Oid = id
            };
            string cgLoad = JsonConvert.SerializeObject (cgModel);
            var cartegraphUrl = String.Format ("https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/Classes/projectFundDrawdownsClass/");
            client.DefaultRequestHeaders.Clear ();
            client.DefaultRequestHeaders.Add ("X-HTTP-Method", "PUT");
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue ("Basic", key);
            string json = "{ 'projectFundDrawdownsClass' : [" + cgLoad + "] }";
            client.DefaultRequestHeaders.Add ("ContentLength", json.Length.ToString ());
            try {
                StringContent strContent = new StringContent (json);
                strContent.Headers.ContentType = MediaTypeHeaderValue.Parse ("application/json;odata=verbose");
                HttpResponseMessage response = client.PutAsync (cartegraphUrl, strContent).Result;
                response.EnsureSuccessStatusCode ();
                var content = await response.Content.ReadAsStringAsync ();
            } catch (Exception ex) {
                System.Diagnostics.Debug.WriteLine (ex.Message);
            }
            await new log ().postLog (_userManager.GetUserName (HttpContext.User), "Put", "Drawdown", model.parentType, model.drawdownID);
        }

        // DELETE
        [HttpDelete ("[action]")]
        public async Task deleteDrawdown ([FromBody] Drawdown model) {
            var key = Environment.GetEnvironmentVariable ("CartegraphAPIkey");
            string id;
            if (model.cartegraphID != null && model.cartegraphID != "") {
                id = model.cartegraphID;
            } else {
                var getURL =
                    String.Format ("https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/classes/projectFundDrawdownsClass?filter=(([drawdownID] is equal to \"{0}\"))",
                        model.drawdownID); // 0
                client.DefaultRequestHeaders.Clear ();
                client.DefaultRequestHeaders.Authorization =
                    new AuthenticationHeaderValue ("Basic", key);
                string content = await client.GetStringAsync (getURL);
                dynamic tag = JObject.Parse (content) ["projectFundDrawdownsClass"][0];
                id = tag.Oid;
            }
            var deleteUrl =
                String.Format ("https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/classes/projectFundDrawdownsClass/{0}",
                    id); // 0
            client.DefaultRequestHeaders.Clear ();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue ("Basic", key);
            try {
                await client.DeleteAsync (deleteUrl);
            } catch (Exception e) {
                Console.WriteLine (e);
            }
            await new log ().postLog (_userManager.GetUserName (HttpContext.User), "Delete", "Drawdown", model.parentType, model.drawdownID);
        }
    }
}