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
    public class subphases : Controller {
        private readonly UserManager<ApplicationUser> _userManager;
        public subphases (UserManager<ApplicationUser> userManager) {
            _userManager = userManager;
        }

        HttpClient client = new HttpClient ();

        public class Subphase {
            public string cartegraphID { get; set; }
            public string endDate { get; set; }
            public string notes { get; set; }
            public int percentComplete { get; set; }
            public string phaseID { get; set; }
            public string projectID { get; set; }
            public string startDate { get; set; }
            public string subphaseDescription { get; set; }
            public string subphaseID { get; set; }
            public string subphaseName { get; set; }
            public string subphaseStatus { get; set; }
        }

        public class CgSubphase {
            public string Oid { get; set; }
            public string subphaseStartDateField { get; set; }
            public string subphaseEndDateField { get; set; }
            public int percentCompleteField { get; set; }
            public string NotesField { get; set; }
            public string phaseIDField { get; set; }
            public string projectIDField { get; set; }
            public string TaskDescriptionField { get; set; }
            public string subphaseIDField { get; set; }
            public string taskNameField { get; set; }
            public string SubPhaseStatusField { get; set; }
            public string subphaseTypeField = "Subphase";

            // req fields, tasks class
            public string ActivityField = "Project Management";
            public string DepartmentField = "Administration";
            public string PriorityField = "None";
        }

        // GET
        [HttpGet ("[action]")]
        public object loadSubphases () {
            List<Subphase> AllSubphases = new List<Subphase> ();
            string subphases = System.IO.File.ReadAllText ("demoData/demoSubphases.json");
            dynamic subphasesObject = JObject.Parse (subphases) ["subphases"];
            foreach (var item in subphasesObject) {
                Subphase sp = new Subphase () {
                    cartegraphID = item.cartegraphID,
                    percentComplete = item.percentComplete,
                    phaseID = item.phaseID,
                    projectID = item.projectID,
                    endDate = item.endDate,
                    notes = item.notes,
                    startDate = item.startDate,
                    subphaseDescription = item.subphaseDescription,
                    subphaseID = item.subphaseID,
                    subphaseName = item.subphaseName,
                    subphaseStatus = item.subphaseStatus
                };
                AllSubphases.Add (sp);
            }
            string cartSubphases = getSubphases ().Result;
            dynamic cartSubphasesObject = JObject.Parse (cartSubphases) ["cgTasksClass"];
            foreach (var item in cartSubphasesObject) {
                Subphase ph = new Subphase () {
                    cartegraphID = item.Oid,
                    percentComplete = item.percentCompleteField,
                    phaseID = item.phaseIDField,
                    projectID = item.projectIDField,
                    endDate = item.subphaseEndDateField,
                    notes = item.NotesField,
                    startDate = item.subphaseStartDateField,
                    subphaseDescription = item.TaskDescriptionField,
                    subphaseID = item.subphaseIDField,
                    subphaseName = item.taskNameField,
                    subphaseStatus = item.SubPhaseStatusField
                };
                AllSubphases.Add (ph);
            }
            return AllSubphases;
        }
        public async Task<string> getSubphases () {
            var key = Environment.GetEnvironmentVariable ("CartegraphAPIkey");
            var cartegraphUrl = "https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/classes/cgTasksClass?filter=(([subphaseType] is equal to \"Subphase\"))";
            client.DefaultRequestHeaders.Clear ();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue ("Basic", key);
            string content = await client.GetStringAsync (cartegraphUrl);
            return content;
        }

        // POST
        [HttpPost ("[action]")]
        public async Task addSubphase ([FromBody] Subphase model) {
            CgSubphase cgModel = new CgSubphase () {
                Oid = model.cartegraphID,
                subphaseStartDateField = model.startDate,
                subphaseEndDateField = model.endDate,
                percentCompleteField = model.percentComplete,
                NotesField = model.notes,
                phaseIDField = model.phaseID,
                projectIDField = model.projectID,
                TaskDescriptionField = model.subphaseDescription,
                subphaseIDField = model.subphaseID,
                taskNameField = model.subphaseName,
                SubPhaseStatusField = model.subphaseStatus
            };
            string cgLoad = JsonConvert.SerializeObject (cgModel);
            var key = Environment.GetEnvironmentVariable ("CartegraphAPIkey");
            var cartegraphUrl = "https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/Classes/cgTasksClass";
            client.DefaultRequestHeaders.Clear ();
            client.DefaultRequestHeaders.Add ("X-HTTP-Method", "POST");
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue ("Basic", key);
            string json = "{ 'cgTasksClass' : [" + cgLoad + "] }";
            Console.WriteLine(json);
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
            await new log ().postLog (_userManager.GetUserName (HttpContext.User), "Post", "Subphase", model.subphaseName, model.subphaseID);
        }

        // PuUT
        [HttpPut ("[action]")]
        public async Task updateSubphase ([FromBody] Subphase model) {
            var key = Environment.GetEnvironmentVariable ("CartegraphAPIkey");
            string id;
            if (model.cartegraphID != null) {
                id = model.cartegraphID;
            } else {
                var getURL =
                    String.Format ("https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/classes/cgTasksClass?filter=(([subphaseID] is equal to \"{0}\"))",
                        model.subphaseID); // 0
                client.DefaultRequestHeaders.Clear ();
                client.DefaultRequestHeaders.Authorization =
                    new AuthenticationHeaderValue ("Basic", key);
                string content = await client.GetStringAsync (getURL);
                dynamic phase = JObject.Parse (content) ["cgTasksClass"][0];
                id = phase.Oid;
            }
            CgSubphase cgModel = new CgSubphase () {
                Oid = id,
                subphaseStartDateField = model.startDate,
                subphaseEndDateField = model.endDate,
                percentCompleteField = model.percentComplete,
                NotesField = model.notes,
                phaseIDField = model.phaseID,
                projectIDField = model.projectID,
                TaskDescriptionField = model.subphaseDescription,
                subphaseIDField = model.subphaseID,
                taskNameField = model.subphaseName,
                SubPhaseStatusField = model.subphaseStatus
            };
            string cgLoad = JsonConvert.SerializeObject (cgModel);
            var cartegraphUrl = String.Format ("https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/Classes/cgTasksClass/");
            client.DefaultRequestHeaders.Clear ();
            client.DefaultRequestHeaders.Add ("X-HTTP-Method", "PUT");
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue ("Basic", key);
            string json = "{ 'cgTasksClass' : [" + cgLoad + "] }";
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
            await new log ().postLog (_userManager.GetUserName (HttpContext.User), "Put", "Subphase", model.subphaseName, model.subphaseID);
        }
    }
}