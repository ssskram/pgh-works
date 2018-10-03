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

        // GET
        [HttpGet ("[action]")]
        public object loadMilestones () {
            List<Milestone> AllMilestones = new List<Milestone> ();
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

        // PUT
        [HttpPut ("[action]")]
        public async Task updateMilestone ([FromBody] Milestone model) {
            var key = Environment.GetEnvironmentVariable ("CartegraphAPIkey");
            string id;
            if (model.cartegraphID != null && model.cartegraphID != "") {
                id = model.cartegraphID;
            } else {
                var getURL =
                    String.Format ("https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/classes/cgTasksClass?filter=(([subphaseID] is equal to \"{0}\"))",
                        model.milestoneID); // 0
                client.DefaultRequestHeaders.Clear ();
                client.DefaultRequestHeaders.Authorization =
                    new AuthenticationHeaderValue ("Basic", key);
                string content = await client.GetStringAsync (getURL);
                dynamic milestone = JObject.Parse (content) ["cgTasksClass"][0];
                id = milestone.Oid;
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

        // DELETE
        [HttpDelete ("[action]")]
        public async Task deleteMilestone ([FromBody] Milestone model) {
            var key = Environment.GetEnvironmentVariable ("CartegraphAPIkey");
            string id;
            if (model.cartegraphID != null && model.cartegraphID != "") {
                id = model.cartegraphID;
            } else {
                var getURL =
                    String.Format ("https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/classes/cgTasksClass?filter=(([subphaseID] is equal to \"{0}\"))",
                        model.milestoneID); // 0
                client.DefaultRequestHeaders.Clear ();
                client.DefaultRequestHeaders.Authorization =
                    new AuthenticationHeaderValue ("Basic", key);
                string content = await client.GetStringAsync (getURL);
                dynamic milestone = JObject.Parse (content) ["cgTasksClass"][0];
                id = milestone.Oid;
            }
            var deleteUrl =
                String.Format ("https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/classes/cgTasksClass/{0}",
                    id); // 0
            client.DefaultRequestHeaders.Clear ();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue ("Basic", key);
            try {
                await client.DeleteAsync (deleteUrl);
            } catch (Exception e) {
                Console.WriteLine (e);
            }
            await new log ().postLog (_userManager.GetUserName (HttpContext.User), "Delete", "Milestone", model.milestoneName, model.milestoneID);
        }
    }
}