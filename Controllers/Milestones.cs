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
    public class milestones : Controller {
        private readonly UserManager<ApplicationUser> _userManager;
        public milestones (UserManager<ApplicationUser> userManager) {
            _userManager = userManager;
        }

        HttpClient client = new HttpClient ();

        public class Milestone {
            public string cartegraphID { get; set; }
            public string dateCompleted { get; set; }
            public string dueDate { get; set; }
            public string milestoneID { get; set; }
            public string milestoneName { get; set; }
            public int percentComplete { get; set; }
            public string phaseID { get; set; }
            public string projectID { get; set; }
            public string notes { get; set; }
        }

        public class CgMilestone {
            public string Oid { get; set; }
            public string subphaseDateCompletedField { get; set; }
            public string subphaseDueDateField { get; set; }
            public string subphaseIDField { get; set; }
            public string taskNameField { get; set; }
            public int percentCompleteField { get; set; }
            public string phaseIDField { get; set; }
            public string projectIDField { get; set; }
            public string NotesField { get; set; }
            public string subphaseType = "Milestone";
        }

        // GET
        [HttpGet ("[action]")]
        public object loadMilestones () {
            List<Milestone> AllMilestones = new List<Milestone> ();
            string milestones = System.IO.File.ReadAllText ("demoData/demoMilestones.json");
            dynamic milestonesObject = JObject.Parse (milestones) ["milestones"];
            foreach (var item in milestonesObject) {
                Milestone ms = new Milestone () {
                    cartegraphID = item.cartegraphID,
                    dateCompleted = item.dateCompleted,
                    dueDate = item.dueDate,
                    milestoneID = item.milestoneID,
                    milestoneName = item.milestoneName,
                    percentComplete = item.percentComplete,
                    phaseID = item.phaseID,
                    projectID = item.projectID,
                    notes = item.notes
                };
                AllMilestones.Add (ms);
            }
            string cartMilestones = getMilestones ().Result;
            dynamic cartMilestonesObject = JObject.Parse (cartMilestones) ["cgTasksClass"];
            foreach (var item in cartMilestonesObject) {
                Milestone ph = new Milestone () {
                    cartegraphID = item.Oid,
                    dateCompleted = item.subphaseDateCompletedField,
                    dueDate = item.subphaseDueDateField,
                    milestoneID = item.subphaseIDField,
                    milestoneName = item.taskNameField,
                    percentComplete = item.percentCompleteField,
                    phaseID = item.phaseIDField,
                    projectID = item.projectIDField,
                    notes = item.NotesField
                };
                AllMilestones.Add (ph);
            }
            return AllMilestones;
        }
        public async Task<string> getMilestones () {
            var key = Environment.GetEnvironmentVariable ("CartegraphAPIkey");
            var cartegraphUrl = "https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/classes/cgTasksClass?filter=(([subphaseType] is equal to \"Milestone\"))";
            client.DefaultRequestHeaders.Clear ();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue ("Basic", key);
            string content = await client.GetStringAsync (cartegraphUrl);
            return content;
        }

        // POST
        [HttpPost ("[action]")]
        public async Task addMilestone ([FromBody] Milestone model) {
            CgMilestone cgModel = new CgMilestone () {
                Oid = model.cartegraphID,
                subphaseDateCompletedField = model.dateCompleted,
                subphaseDueDateField = model.dueDate,
                subphaseIDField = model.milestoneID,
                taskNameField = model.milestoneName,
                percentCompleteField = model.percentComplete,
                phaseIDField = model.phaseID,
                projectIDField = model.projectID,
                NotesField = model.notes
            };
            string cgLoad = JsonConvert.SerializeObject (cgModel);
            var key = Environment.GetEnvironmentVariable ("CartegraphAPIkey");
            var cartegraphUrl = "https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/Classes/cgTasksClass";
            client.DefaultRequestHeaders.Clear ();
            client.DefaultRequestHeaders.Add ("X-HTTP-Method", "POST");
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue ("Basic", key);
            string json = "{ 'cgTasksClass' : [" + cgLoad + "] }";
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
            await new log ().postLog (_userManager.GetUserName (HttpContext.User), "Post", "Milestone", model.milestoneName, model.milestoneID);
        }

        // PuUT
        [HttpPut ("[action]")]
        public async Task updateMilestone ([FromBody] Milestone model) {
            var key = Environment.GetEnvironmentVariable ("CartegraphAPIkey");
            string id;
            if (model.cartegraphID != null) {
                id = model.cartegraphID;
            } else {
                var getURL =
                    String.Format ("https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/classes/cgTasksClass?filter=(([subphaseID] is equal to \"{0}\"))",
                        model.milestoneID); // 0
                client.DefaultRequestHeaders.Clear ();
                client.DefaultRequestHeaders.Authorization =
                    new AuthenticationHeaderValue ("Basic", key);
                string content = await client.GetStringAsync (getURL);
                dynamic phase = JObject.Parse (content) ["cgTasksClass"][0];
                id = phase.Oid;
            }
            CgMilestone cgModel = new CgMilestone () {
                Oid = id,
                subphaseDateCompletedField = model.dateCompleted,
                subphaseDueDateField = model.dueDate,
                subphaseIDField = model.milestoneID,
                taskNameField = model.milestoneName,
                percentCompleteField = model.percentComplete,
                phaseIDField = model.phaseID,
                projectIDField = model.projectID,
                NotesField = model.notes
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
            await new log ().postLog (_userManager.GetUserName (HttpContext.User), "Put", "Milestone", model.milestoneName, model.milestoneID);
        }
    }
}