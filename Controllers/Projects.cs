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
    public class projects : Controller {
        private readonly UserManager<ApplicationUser> _userManager;
        public projects (UserManager<ApplicationUser> userManager) {
            _userManager = userManager;
        }
        HttpClient client = new HttpClient ();

        // GET
        [HttpGet ("[action]")]
        public object loadProjects () {
            List<Project> AllProjects = new List<Project> ();
            string demoProjects = System.IO.File.ReadAllText ("demoData/demoProjects.json");
            dynamic demoProjectsObject = JObject.Parse (demoProjects) ["projects"];
            foreach (var item in demoProjectsObject) {
                Project pj = new Project () {
                    cartegraphID = item.cartegraphID,
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
                    projectBudget = item.projectBudget,
                    shape = item.shape.ToObject<Shape> ()
                };
                AllProjects.Add (pj);
            }
            string cartProjects = getProjects ().Result;
            dynamic cartProjectsObject = JObject.Parse (cartProjects) ["ProjectsClass"];
            foreach (var item in cartProjectsObject) {
                Project pj = new Project () {
                    cartegraphID = item.Oid,
                    projectID = item.projectIDField,
                    notes = item.projectNotesField,
                    actualEndDate = item.projectEndDateField,
                    actualStartDate = item.projectStartDateField,
                    expectedEndDate = item.expectedEndDateField,
                    expectedStartDate = item.expectedStartDateField,
                    projectDepartment = item.projectDepartmentField,
                    projectDescription = item.projectDescriptionField,
                    projectManager = item.projectManagerField,
                    projectMembers = item.projectMembersField,
                    projectName = item.projectNameField,
                    projectStatus = item.projectStatusField,
                    projectBudget = item.projectBudgetField,
                    shape = item.CgShape.ToObject<Shape> ()
                };
                AllProjects.Add (pj);
            }
            return AllProjects;
        }
        public async Task<string> getProjects () {
            var key = Environment.GetEnvironmentVariable ("CartegraphAPIkey");
            var cartegraphUrl = "https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/classes/ProjectsClass";
            client.DefaultRequestHeaders.Clear ();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue ("Basic", key);
            string content = await client.GetStringAsync (cartegraphUrl);
            return content;
        }

        // POST
        [HttpPost ("[action]")]
        public async Task addProject ([FromBody] Project model) {
            CgProject cgModel = new CgProject () {
                projectEndDateField = model.actualEndDate,
                projectStartDateField = model.actualStartDate,
                expectedStartDateField = model.expectedStartDate,
                expectedEndDateField = model.expectedEndDate,
                projectNotesField = model.notes,
                projectDepartmentField = model.projectDepartment,
                projectDescriptionField = model.projectDescription,
                projectIDField = model.projectID,
                projectManagerField = model.projectManager,
                projectMembersField = model.projectMembers,
                projectNameField = model.projectName,
                projectStatusField = model.projectStatus,
                projectBudgetField = model.projectBudget,
                CgShape = model.shape
            };
            string cgLoad = JsonConvert.SerializeObject (cgModel);
            var key = Environment.GetEnvironmentVariable ("CartegraphAPIkey");
            var cartegraphUrl = "https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/Classes/ProjectsClass";
            client.DefaultRequestHeaders.Clear ();
            client.DefaultRequestHeaders.Add ("X-HTTP-Method", "POST");
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue ("Basic", key);
            string json = "{ 'ProjectsClass' : [" + cgLoad + "] }";
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
            await new log ().postLog (_userManager.GetUserName (HttpContext.User), "Post", "Project", model.projectName, model.projectID);
            await generateDocLibrary (model.projectName.ToString ());
        }

        // PuUT
        [HttpPut ("[action]")]
        public async Task updateProject ([FromBody] Project model) {
            var key = Environment.GetEnvironmentVariable ("CartegraphAPIkey");
            string id;
            if (model.cartegraphID != null && model.cartegraphID != "") {
                id = model.cartegraphID;
            } else {
                var getURL =
                    String.Format ("https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/classes/ProjectsClass?filter=(([projectID] is equal to \"{0}\"))",
                        model.projectID); // 0
                client.DefaultRequestHeaders.Clear ();
                client.DefaultRequestHeaders.Authorization =
                    new AuthenticationHeaderValue ("Basic", key);
                string content = await client.GetStringAsync (getURL);
                dynamic project = JObject.Parse (content) ["ProjectsClass"][0];
                id = project.Oid;
            }
            CgProject cgModel = new CgProject () {
                projectEndDateField = model.actualEndDate,
                Oid = id,
                projectStartDateField = model.actualStartDate,
                expectedStartDateField = model.expectedStartDate,
                expectedEndDateField = model.expectedEndDate,
                projectNotesField = model.notes,
                projectDepartmentField = model.projectDepartment,
                projectDescriptionField = model.projectDescription,
                projectIDField = model.projectID,
                projectManagerField = model.projectManager,
                projectMembersField = model.projectMembers,
                projectNameField = model.projectName,
                projectStatusField = model.projectStatus,
                projectBudgetField = model.projectBudget,
                CgShape = model.shape
            };
            string cgLoad = JsonConvert.SerializeObject (cgModel);
            var cartegraphUrl = String.Format ("https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/Classes/ProjectsClass/");
            client.DefaultRequestHeaders.Clear ();
            client.DefaultRequestHeaders.Add ("X-HTTP-Method", "PUT");
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue ("Basic", key);
            string json = "{ 'ProjectsClass' : [" + cgLoad + "] }";
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
            await new log ().postLog (_userManager.GetUserName (HttpContext.User), "Put", "Project", model.projectName, model.projectID);
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