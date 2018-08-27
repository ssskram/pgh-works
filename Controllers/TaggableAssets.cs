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
    public class assets : Controller {
        HttpClient client = new HttpClient ();

        // empty list to write all assets
        List<TaggableAssets> AllAssets = new List<TaggableAssets> ();

        // GET
        [HttpGet ("[action]")]
        public async Task<object> loadTaggableAssets () {
            await getFacilities ();
            return AllAssets;
        }

        public async Task getFacilities () {
            var key = Environment.GetEnvironmentVariable ("CartegraphAPIkey");
            var cartegraphUrl = "https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/Classes/cgFacilitiesClass?fields=Oid,CgShape,IDField";
            client.DefaultRequestHeaders.Clear ();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue ("Basic", key);
            string content = await client.GetStringAsync (cartegraphUrl);
            dynamic facilities = JObject.Parse(content)["cgFacilitiesClass"];
            foreach (var item in facilities) {
                TaggableAssets ta = new TaggableAssets () {
                    assetType = "Facility",
                    assetOID = item.Oid,
                    assetName = item.IDField,
                    shape = item.CgShape.ToObject<Shape>()
                };
                AllAssets.Add (ta);
            }
        }
    }
}