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

        public class Project {
            public string actualEndDate { get; set; }
            public string actualStartDate { get; set; }
            public string cartegraphID { get; set; }
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
            public string projectBudget { get; set; }
            public List<Shape> shape { get; set; }
        }

        public class Shape {
            public double lat { get; set; }
            public double lng { get; set; }
        }

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
                    shape = item.shape.ToObject<List<Shape>> ()
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
                    shape = item.shape.ToObject<List<Shape>> ()
                };
                AllProjects.Add (pj);
            }
            return AllProjects;
        }
        public async Task<string> getProjects () {
            var key = Environment.GetEnvironmentVariable ("CartegraphAPIkey");
            var cartegraphUrl = "https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/Classes/ProjectsClass?fields=Oid,CgShape,projectNameField";
            client.DefaultRequestHeaders.Clear ();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue ("Basic", key);
            string content = await client.GetStringAsync (cartegraphUrl);
            return content;
        }

        // POST
        [HttpPost ("[action]")]
        public async Task addProject ([FromBody] Project model) {
            // var key = Environment.GetEnvironmentVariable ("CartegraphAPIkey");
            // var cartegraphUrl = "https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/Classes/ProjectsClass";
            // client.DefaultRequestHeaders.Clear ();
            // client.DefaultRequestHeaders.Add ("X-HTTP-Method", "POST");
            // client.DefaultRequestHeaders.Authorization =
            //     new AuthenticationHeaderValue ("Basic", key);
            // var json =
            //     String.Format ("{{ 'cgRequestsClass' : [ {{ 'BuildingNameField' : '{0}' , 'IssueField' : '{1}' , 'DescriptionField' : '{2}', 'SubmitterPhoneNumberField' : '{3}', 'SubmittedByField' : '{4}', 'LocationDescriptionField' : '{5}', 'InternalRequestDepartmentField' : '{6}' }} ] }}",
            //         model.actualEndDate, // 0
            //         model.actualEndDate, // 1
            //         model.expectedStartDate, // 2
            //         model.expectedEndDate, // 3
            //         model.notes, // 4
            //         model.projectDepartment, // 5
            //         model.projectDescription, // 6
            //         model.projectID, // 7
            //         model.projectManager, // 8
            //         model.projectMembers, // 9
            //         model.projectName, // 10
            //         model.projectStatus, // 11
            //         model.projectBudget, // 12
            //         model.shape); // 13
            // client.DefaultRequestHeaders.Add ("ContentLength", json.Length.ToString ());
            // try {
            //     StringContent strContent = new StringContent (json);
            //     strContent.Headers.ContentType = MediaTypeHeaderValue.Parse ("application/json;odata=verbose");
            //     HttpResponseMessage response = client.PostAsync (cartegraphUrl, strContent).Result;
            //     response.EnsureSuccessStatusCode ();
            //     var content = await response.Content.ReadAsStringAsync ();
            // } catch (Exception ex) {
            //     System.Diagnostics.Debug.WriteLine (ex.Message);
            // }
            await new log ().postLog (_userManager.GetUserName (HttpContext.User), "Post", "Project", model.projectName, model.projectID);
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