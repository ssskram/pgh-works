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
    public class activity : Controller {
        private readonly UserManager<ApplicationUser> _userManager;
        public activity (UserManager<ApplicationUser> userManager) {
            _userManager = userManager;
        }

        HttpClient client = new HttpClient ();

        // GET
        [HttpGet ("[action]")]
        public object loadActivity () {
            List<Activities> AllActivity = new List<Activities> ();
            string activity = getActivity ().Result;
            dynamic activityObject = JObject.Parse (activity) ["PGHWorksActivitiesClass"];
            foreach (var item in activityObject) {
                Activities ph = new Activities () {
                    cartegraphID = item.Oid,
                    activityID = item.activityIDField,
                    user = item.userIDField,
                    activity = item.activityField,
                    date = item.activityDateField,
                    parentID = item.parentIDField,
                    parentType = item.parentTypeField
                };
                AllActivity.Add (ph);
            }
            return AllActivity;
        }

        public async Task<string> getActivity () {
            var key = Environment.GetEnvironmentVariable ("CartegraphAPIkey");
            var cartegraphUrl = "https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/classes/PGHWorksActivitiesClass";
            client.DefaultRequestHeaders.Clear ();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue ("Basic", key);
            string content = await client.GetStringAsync (cartegraphUrl);
            return content;
        }

        // POST
        [HttpPost ("[action]")]
        public async Task addActivity ([FromBody] Activities model) {
            CgActivity cgModel = new CgActivity () {
                Oid = model.cartegraphID,
                activityIDField = model.activityID,
                activityField = model.activity,
                userIDField = model.user,
                activityDateField = model.date,
                parentIDField = model.parentID,
                parentTypeField = model.parentType
            };
            string cgLoad = JsonConvert.SerializeObject (cgModel);
            var key = Environment.GetEnvironmentVariable ("CartegraphAPIkey");
            var cartegraphUrl = "https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/classes/PGHWorksActivitiesClass";
            client.DefaultRequestHeaders.Clear ();
            client.DefaultRequestHeaders.Add ("X-HTTP-Method", "POST");
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue ("Basic", key);
            string json = "{ 'PGHWorksActivitiesClass' : [" + cgLoad + "] }";
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
        }
    }
}