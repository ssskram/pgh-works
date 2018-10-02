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
using System.Linq;
using pghworks.Models;

namespace pghworks.Controllers {
    [Authorize]
    [Route ("api/[controller]")]
    public class personnel : Controller {
        HttpClient client = new HttpClient ();

        // GET
        [HttpGet ("[action]")]
        public async Task<object> loadPersonnel () {
            await GetUserGroup ();
            var usergroup = GetUserGroup ().Result;
            dynamic userObject = JObject.Parse (usergroup) ["d"];
            string backToJson = JsonConvert.SerializeObject(userObject);
            var o = JObject.Parse (backToJson);
            var a = o.SelectToken ("results").Select (jt => jt.ToObject<Personnel> ()).ToList ();
            List<Personnel> AllPersonnel = new List<Personnel> ();
            foreach (var item in a) {
                Personnel pn = new Personnel () {
                    email = item.email,
                    title = item.title
                };
                AllPersonnel.Add (pn);
            }
            return AllPersonnel;
        }

        public async Task<string> GetUserGroup () {
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
            string accesstoken = results.access_token.ToString ();
            var sharepointUrl = "https://cityofpittsburgh.sharepoint.com/sites/pghworks/_api/web/sitegroups(5)/users?$select=Title,Email";
            client.DefaultRequestHeaders.Clear ();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue ("Bearer", accesstoken);
            client.DefaultRequestHeaders.Add ("Accept", "application/json;odata=verbose");
            string group = await client.GetStringAsync (sharepointUrl);
            return group;
        }

    }
}