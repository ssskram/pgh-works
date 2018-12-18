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
    public class phases : Controller {
        private readonly UserManager<ApplicationUser> _userManager;
        public phases (UserManager<ApplicationUser> userManager) {
            _userManager = userManager;
        }

        HttpClient client = new HttpClient ();

        // GET
        [HttpGet ("[action]")]
        public object loadPhases () {
            List<Phase> AllPhases = new List<Phase> ();
            string cartPhases = getPhases ().Result;
            dynamic cartPhasesObject = JObject.Parse (cartPhases) ["cgWorkOrdersClass"];
            foreach (var item in cartPhasesObject) {
                Phase ph = new Phase () {
                    actualEndDate = item.phaseActualEndDateField,
                    actualStartDate = item.phaseActualStartDateField,
                    cartegraphID = item.Oid,
                    expectedEndDate = item.phaseExpectedEndDateField,
                    expectedStartDate = item.phaseExpectedStartDateField,
                    notes = item.NotesField,
                    phaseDescription = item.phaseDescriptionField,
                    phaseID = item.phaseIDField,
                    phaseName = item.phaseNameField,
                    phaseType = item.phaseTypeField,
                    phaseStatus = item.phaseStatusField,
                    projectID = item.projectIDField
                };
                AllPhases.Add (ph);
            }
            return AllPhases;
        }
        public async Task<string> getPhases () {
            var key = Environment.GetEnvironmentVariable ("CartegraphAPIkey");
            var cartegraphUrl = "https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/classes/cgWorkOrdersClass?limit=10000&offset=0&filter=([projectID] is not equal to \"\")";
            client.DefaultRequestHeaders.Clear ();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue ("Basic", key);
            string content = await client.GetStringAsync (cartegraphUrl);
            return content;
        }

        // POST
        [HttpPost ("[action]")]
        public async Task addPhase ([FromBody] Phase model) {
            CgPhase cgModel = new CgPhase () {
                phaseActualStartDateField = model.actualStartDate,
                phaseActualEndDateField = model.actualEndDate,
                phaseExpectedEndDateField = model.expectedEndDate,
                phaseExpectedStartDateField = model.expectedStartDate,
                NotesField = model.notes,
                phaseDescriptionField = model.phaseDescription,
                phaseIDField = model.phaseID,
                phaseNameField = model.phaseName,
                phaseStatusField = model.phaseStatus,
                phaseTypeField = model.phaseType,
                projectIDField = model.projectID
            };
            string cgLoad = JsonConvert.SerializeObject (cgModel);
            var key = Environment.GetEnvironmentVariable ("CartegraphAPIkey");
            var cartegraphUrl = "https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/classes/cgWorkOrdersClass";
            client.DefaultRequestHeaders.Clear ();
            client.DefaultRequestHeaders.Add ("X-HTTP-Method", "POST");
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue ("Basic", key);
            string json = "{ 'cgWorkOrdersClass' : [" + cgLoad + "] }";
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
            await new log ().postLog (_userManager.GetUserName (HttpContext.User), "Post", "Phase", model.phaseName, model.phaseID);
        }

        // PuUT
        [HttpPut ("[action]")]
        public async Task updatePhase ([FromBody] Phase model) {
            var key = Environment.GetEnvironmentVariable ("CartegraphAPIkey");
            string id;
            if (model.cartegraphID != null && model.cartegraphID != "") {
                id = model.cartegraphID;
            } else {
                var getURL =
                    String.Format ("https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/classes/cgWorkOrdersClass?filter=(([phaseID] is equal to \"{0}\"))",
                        model.phaseID); // 0
                client.DefaultRequestHeaders.Clear ();
                client.DefaultRequestHeaders.Authorization =
                    new AuthenticationHeaderValue ("Basic", key);
                string content = await client.GetStringAsync (getURL);
                dynamic phase = JObject.Parse (content) ["cgWorkOrdersClass"][0];
                id = phase.Oid;
            }
            CgPhase cgModel = new CgPhase () {
                Oid = id,
                phaseActualStartDateField = model.actualStartDate,
                phaseActualEndDateField = model.actualEndDate,
                phaseExpectedEndDateField = model.expectedEndDate,
                phaseExpectedStartDateField = model.expectedStartDate,
                NotesField = model.notes,
                phaseDescriptionField = model.phaseDescription,
                phaseIDField = model.phaseID,
                phaseNameField = model.phaseName,
                phaseTypeField = model.phaseType,
                phaseStatusField = model.phaseStatus,
                projectIDField = model.projectID
            };
            string cgLoad = JsonConvert.SerializeObject (cgModel);
            var cartegraphUrl = String.Format ("https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/Classes/cgWorkOrdersClass/");
            client.DefaultRequestHeaders.Clear ();
            client.DefaultRequestHeaders.Add ("X-HTTP-Method", "PUT");
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue ("Basic", key);
            string json = "{ 'cgWorkOrdersClass' : [" + cgLoad + "] }";
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
            await new log ().postLog (_userManager.GetUserName (HttpContext.User), "Put", "Phase", model.phaseName, model.phaseID);
        }

        // DELETE
        [HttpDelete ("[action]")]
        public async Task deletePhase ([FromBody] Phase model) {
            var key = Environment.GetEnvironmentVariable ("CartegraphAPIkey");
            string id;
            if (model.cartegraphID != null && model.cartegraphID != "") {
                id = model.cartegraphID;
            } else {
                var getURL =
                    String.Format ("https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/classes/cgWorkOrdersClass?filter=(([phaseID] is equal to \"{0}\"))",
                        model.phaseID); // 0
                client.DefaultRequestHeaders.Clear ();
                client.DefaultRequestHeaders.Authorization =
                    new AuthenticationHeaderValue ("Basic", key);
                string content = await client.GetStringAsync (getURL);
                dynamic phase = JObject.Parse (content) ["cgWorkOrdersClass"][0];
                id = phase.Oid;
            }
            var deleteUrl =
                String.Format ("https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/classes/cgWorkOrdersClass/{0}",
                    id); // 0
            client.DefaultRequestHeaders.Clear ();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue ("Basic", key);
            await client.DeleteAsync (deleteUrl);
            await deleteTasks (model.phaseID);
            await deleteTags (model.phaseID);
            await new log ().postLog (_userManager.GetUserName (HttpContext.User), "Delete", "Phase", model.phaseName, model.phaseID);
        }

        public async Task deleteTasks (string phaseID) {
            // grab child milestones/subphases and call up delete
            var key = Environment.GetEnvironmentVariable ("CartegraphAPIkey");
            var getURL =
                String.Format ("https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/classes/cgTasksClass?filter=(([phaseID] is equal to \"{0}\"))",
                    phaseID); // 0
            client.DefaultRequestHeaders.Clear ();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue ("Basic", key);
            string content = await client.GetStringAsync (getURL);
            dynamic tasks = JObject.Parse (content) ["cgTasksClass"];
            foreach (var item in tasks) {
                var deleteUrl =
                    String.Format ("https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/classes/cgTasksClass/{0}",
                        item.Oid); // 0
                client.DefaultRequestHeaders.Clear ();
                client.DefaultRequestHeaders.Authorization =
                    new AuthenticationHeaderValue ("Basic", key);
                await client.DeleteAsync (deleteUrl);
            }
        }

        public async Task deleteTags (string parentID) {
            // grab child tags and call delete
            var key = Environment.GetEnvironmentVariable ("CartegraphAPIkey");
            var getURL =
                String.Format ("https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/classes/ProjectTagsClass?filter=(([parentID] is equal to \"{0}\"))",
                    parentID); // 0
            client.DefaultRequestHeaders.Clear ();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue ("Basic", key);
            string content = await client.GetStringAsync (getURL);
            dynamic tags = JObject.Parse (content) ["ProjectTagsClass"];
            foreach (var item in tags) {
                var deleteUrl =
                    String.Format ("https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/classes/ProjectTagsClass/{0}",
                        item.Oid); // 0
                client.DefaultRequestHeaders.Clear ();
                client.DefaultRequestHeaders.Authorization =
                    new AuthenticationHeaderValue ("Basic", key);
                await client.DeleteAsync (deleteUrl);
            }
        }
    }
}