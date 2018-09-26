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
    public class projects : Controller {
        HttpClient client = new HttpClient ();

        public class Project {
            public string actualEndDate { get; set; }
            public string actualStartDate { get; set; }
            public string cartegraphID { get; set; }
            public string created { get; set; }
            public string expectedStartDate { get; set; }
            public string expectedEndDate { get; set; }
            public string notes { get; set; }
            public string projectDepartment { get; set; }
            public string projectDescription { get; set; }
            public string projectID { get; set; }
            public string projectManager { get; set; }
            public string projectMembers { get; set; }
            public string projectName { get; set; }
            public string projectStatus { get; set; }
            public List<Shape> shape { get; set; }
        }

        public class Shape {
            public double lat { get; set; }
            public double lng { get; set; }
        }

        // GET
        [HttpGet ("[action]")]
        public object loadProjects () {
            string projects = System.IO.File.ReadAllText ("demoData/demoProjects.json");
            dynamic projectsObject = JObject.Parse (projects) ["projects"];
            List<Project> AllProjects = new List<Project> ();
            foreach (var item in projectsObject) {
                Project pj = new Project () {
                    cartegraphID = item.cartegraphID,
                    created = item.created,
                    projectID = item.projectID,
                    notes = item.notes,
                    actualEndDate = item.actualEndDate,
                    actualStartDate = item.actualStartDate,
                    expectedEndDate = item.expectedEndDate,
                    expectedStartDate = item.expectedStartDate,
                    projectDepartment = item.projectDepartment,
                    projectDescription = item.projectDescription,
                    projectManager = item.projectManager,
                    projectMembers = item.projectMembers,
                    projectName = item.projectName,
                    projectStatus = item.projectStatus,
                    shape = item.shape.ToObject<List<Shape>> ()
                };
                AllProjects.Add (pj);
            }
            return AllProjects;
        }

        // POST
        [HttpPost ("[action]")]
        public async Task addProject ([FromBody] Project model) {
            await generateDocLibrary (model.projectName.ToString ());
        }

        public async Task generateDocLibrary (string projectName) {
            await refreshtoken ();
            var token = refreshtoken ().Result;
            var sharepointUrl = "https://cityofpittsburgh.sharepoint.com/sites/pghworks/_api/web/lists";
            client.DefaultRequestHeaders.Clear ();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue ("Bearer", token);
            client.DefaultRequestHeaders.Add ("Accept", "application/json;odata=verbose");
            client.DefaultRequestHeaders.Add ("X-RequestDigest", "form digest value");
            client.DefaultRequestHeaders.Add ("X-HTTP-Method", "POST");
            var json =
                String.Format ("{{ '__metadata': {{ 'type': 'SP.List' }}, 'AllowContentTypes': true, 'BaseTemplate': 101, 'ContentTypesEnabled': true, 'Description': 'Document library for {0}', 'Title': '{0}' }}",
                    projectName);

            client.DefaultRequestHeaders.Add ("ContentLength", json.Length.ToString ());
            try // post
            {
                StringContent strContent = new StringContent (json);
                strContent.Headers.ContentType = MediaTypeHeaderValue.Parse ("application/json;odata=verbose");
                HttpResponseMessage response = client.PostAsync (sharepointUrl, strContent).Result;
                response.EnsureSuccessStatusCode ();
                var content = await response.Content.ReadAsStringAsync ();
            } catch (Exception ex) {
                System.Diagnostics.Debug.WriteLine (ex.Message);
            }
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