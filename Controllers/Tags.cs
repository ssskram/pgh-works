using System;
using System.Collections.Generic;
using System.Collections.Specialized;
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
    public class tags : Controller {
        HttpClient client = new HttpClient ();

        public class Tag {
            public string parentID { get; set; }
            public string parentName { get; set; }
            public string parentType { get; set; }
            public string tagDescription { get; set; }
            public string tagID { get; set; }
            public string tagType { get; set; }
            public string taggedAssetName { get; set; }
            public string taggedAssetOID { get; set; }
        }

        // GET
        [HttpGet ("[action]")]
        public object loadTags () {
            string tags = System.IO.File.ReadAllText ("demoData/demoTags.json");
            dynamic tagObject = JObject.Parse (tags) ["tags"];
            List<Tag> AllTags = new List<Tag> ();
            foreach (var item in tagObject) {
                Tag tg = new Tag () {
                    parentID = item.parentID,
                    parentName = item.parentName,
                    parentType = item.parentType,
                    tagDescription = item.tagDescription,
                    tagID = item.tagID,
                    tagType = item.tagType,
                    taggedAssetName = item.taggedAssetName,
                    taggedAssetOID = item.taggedAssetOID
                };
                AllTags.Add(tg);
            }
            return AllTags;
        }

    }
}