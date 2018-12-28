using System;
using System.Collections.Generic;
using System.Collections.Specialized;
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
    public class tags : Controller {
        private readonly UserManager<ApplicationUser> _userManager;
        public tags (UserManager<ApplicationUser> userManager) {
            _userManager = userManager;
        }

        HttpClient client = new HttpClient ();

        // GET
        [HttpGet ("[action]")]
        public object loadTags () {
            List<Tag> AllTags = new List<Tag> ();
            string cartTags = getTags ().Result;
            dynamic cartTagsObject = JObject.Parse (cartTags) ["ProjectTagsClass"];
            foreach (var item in cartTagsObject) {
                Tag ph = new Tag () {
                    parentID = item.parentIDField,
                    parentName = item.parentNameField,
                    parentType = item.parentTypeField,
                    tagDescription = item.tagDescriptionField,
                    tagID = item.tagIDField,
                    tagType = item.tagTypeField,
                    taggedAssetName = item.taggedAssetNameField,
                    taggedAssetOID = item.taggedAssetOIDField,
                    cartegraphID = item.Oid
                };
                AllTags.Add (ph);
            }
            return AllTags;
        }
        public async Task<string> getTags () {
            var key = Environment.GetEnvironmentVariable ("CartegraphAPIkey");
            var cartegraphUrl = "https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/classes/ProjectTagsClass?limit=10000&offset=0";
            client.DefaultRequestHeaders.Clear ();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue ("Basic", key);
            string content = await client.GetStringAsync (cartegraphUrl);
            return content;
        }

        // POST
        [HttpPost ("[action]")]
        public async Task addTag ([FromBody] Tag model) {
            CgTag cgModel = new CgTag () {
                parentIDField = model.parentID,
                parentNameField = model.parentName,
                parentTypeField = model.parentType,
                tagDescriptionField = model.tagDescription,
                tagIDField = model.tagID,
                tagTypeField = model.tagType,
                taggedAssetNameField = model.taggedAssetName,
                taggedAssetOIDField = model.taggedAssetOID
            };
            string cgLoad = JsonConvert.SerializeObject (cgModel);
            var key = Environment.GetEnvironmentVariable ("CartegraphAPIkey");
            var cartegraphUrl = "https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/Classes/ProjectTagsClass";
            client.DefaultRequestHeaders.Clear ();
            client.DefaultRequestHeaders.Add ("X-HTTP-Method", "POST");
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue ("Basic", key);
            string json = "{ 'ProjectTagsClass' : [" + cgLoad + "] }";
            client.DefaultRequestHeaders.Add ("ContentLength", json.Length.ToString ());
            try {
                StringContent strContent = new StringContent (json);
                strContent.Headers.ContentType = MediaTypeHeaderValue.Parse ("application/json;odata=verbose");
                HttpResponseMessage response = client.PostAsync (cartegraphUrl, strContent).Result;
                response.EnsureSuccessStatusCode ();
                var content = await response.Content.ReadAsStringAsync ();
            } catch (Exception ex) {
                Console.WriteLine(ex);
                System.Diagnostics.Debug.WriteLine (ex.Message);
            }
            await new log ().postLog (_userManager.GetUserName (HttpContext.User), "Post", "Tag", model.taggedAssetName, model.tagID);
        }

        // DELETE
        [HttpDelete ("[action]")]
        public async Task deleteTag ([FromBody] Tag model) {
            var key = Environment.GetEnvironmentVariable ("CartegraphAPIkey");
            string id;
            if (model.cartegraphID != null && model.cartegraphID != "") {
                id = model.cartegraphID;
            } else {
                var getURL =
                    String.Format ("https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/classes/ProjectTagsClass?filter=(([tagID] is equal to \"{0}\"))",
                        model.tagID); // 0
                client.DefaultRequestHeaders.Clear ();
                client.DefaultRequestHeaders.Authorization =
                    new AuthenticationHeaderValue ("Basic", key);
                string content = await client.GetStringAsync (getURL);
                dynamic tag = JObject.Parse (content) ["ProjectTagsClass"][0];
                id = tag.Oid;
            }
            var deleteUrl =
                String.Format ("https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/classes/ProjectTagsClass/{0}",
                    id); // 0
            client.DefaultRequestHeaders.Clear ();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue ("Basic", key);
            try {
                await client.DeleteAsync (deleteUrl);
            } catch (Exception e) {
                Console.WriteLine (e);
            }
            await new log ().postLog (_userManager.GetUserName (HttpContext.User), "Delete", "Tag", model.taggedAssetName, model.tagID);
        }
    }
}