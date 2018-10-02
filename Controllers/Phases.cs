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

        public class Phase {
            public string actualEndDate { get; set; }
            public string actualStartDate { get; set; }
            public string cartegraphID { get; set; }
            public string expectedEndDate { get; set; }
            public string expectedStartDate { get; set; }
            public string notes { get; set; }
            public string phaseDescription { get; set; }
            public PhaseFollows phaseFollows { get; set; }
            public string phaseID { get; set; }
            public string phaseName { get; set; }
            public string phaseStatus { get; set; }
            public string projectID { get; set; }
        }
        public class PhaseFollows {
            public string project { get; set; }
            public string phase { get; set; }
        }

        public class CgPhase {
            public string actualEndDateField { get; set; }
            public string actualStartDateField { get; set; }
            public string Oid { get; set; }
            public string expectedEndDateField { get; set; }
            public string expectedStartDateField { get; set; }
            public string NotesField { get; set; }
            public string phaseDescriptionField { get; set; }
            public string phaseFollowsField { get; set; }
            public string phaseIDField { get; set; }
            public string phaseNameField { get; set; }
            public string phaseStatusField { get; set; }
            public string projectIDField { get; set; }
            public string PriorityField = "None";
        }

        // GET
        [HttpGet ("[action]")]
        public object loadPhases () {
            List<Phase> AllPhases = new List<Phase> ();
            string phases = System.IO.File.ReadAllText ("demoData/demoPhases.json");
            dynamic phasesObject = JObject.Parse (phases) ["phases"];
            foreach (var item in phasesObject) {
                Phase ph = new Phase () {
                    actualEndDate = item.actualEndDate,
                    actualStartDate = item.actualStartDate,
                    cartegraphID = item.cartegraphID,
                    expectedEndDate = item.expectedEndDate,
                    expectedStartDate = item.expectedStartDate,
                    notes = item.notes,
                    phaseDescription = item.phaseDescription,
                    phaseFollows = item.phaseFollows.ToObject<PhaseFollows> (),
                    phaseID = item.phaseID,
                    phaseName = item.phaseName,
                    phaseStatus = item.phaseStatus,
                    projectID = item.projectID
                };
                AllPhases.Add (ph);
            }
            string cartPhases = getPhases ().Result;
            dynamic cartPhasesObject = JObject.Parse (cartPhases) ["cgWorkOrdersClass"];
            foreach (var item in cartPhasesObject) {
                if (item.projectIDField != "") {
                    Phase ph = new Phase () {
                    actualEndDate = item.actualEndDateField,
                    actualStartDate = item.actualStartDateField,
                    cartegraphID = item.Oid,
                    expectedEndDate = item.expectedEndDateField,
                    expectedStartDate = item.expectedStartDateField,
                    notes = item.NotesField,
                    phaseDescription = item.phaseDescriptionField,
                    phaseFollows = item.phaseFollowsField.ToObject<PhaseFollows> (),
                    phaseID = item.phaseIDField,
                    phaseName = item.phaseNameField,
                    phaseStatus = item.phaseStatusField,
                    projectID = item.projectIDField
                    };
                    AllPhases.Add (ph);
                }
            }
            return AllPhases;
        }
        public async Task<string> getPhases () {
            var key = Environment.GetEnvironmentVariable ("CartegraphAPIkey");
            var cartegraphUrl = "https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/classes/cgWorkOrdersClass";
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
                actualStartDateField = model.actualStartDate,
                actualEndDateField = model.actualEndDate,
                expectedEndDateField = model.expectedEndDate,
                expectedStartDateField = model.expectedStartDate,
                NotesField = model.notes,
                phaseDescriptionField = model.phaseDescription,
                phaseIDField = model.phaseID,
                phaseNameField = model.phaseName,
                phaseStatusField = model.phaseStatus,
                projectIDField = model.projectID,
                phaseFollowsField = model.phaseFollows.ToString ()
            };
            string cgLoad = JsonConvert.SerializeObject (cgModel);
            var key = Environment.GetEnvironmentVariable ("CartegraphAPIkey");
            var cartegraphUrl = "https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/classes/cgWorkOrdersClass";
            client.DefaultRequestHeaders.Clear ();
            client.DefaultRequestHeaders.Add ("X-HTTP-Method", "POST");
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue ("Basic", key);
            string json = "{ 'cgWorkOrdersClass' : [" + cgLoad + "] }";
            Console.WriteLine (json);
            client.DefaultRequestHeaders.Add ("ContentLength", json.Length.ToString ());
            try {
                StringContent strContent = new StringContent (json);
                strContent.Headers.ContentType = MediaTypeHeaderValue.Parse ("application/json;odata=verbose");
                HttpResponseMessage response = client.PostAsync (cartegraphUrl, strContent).Result;
                Console.WriteLine (response);
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
                actualStartDateField = model.actualStartDate,
                actualEndDateField = model.actualEndDate,
                expectedEndDateField = model.expectedEndDate,
                expectedStartDateField = model.expectedStartDate,
                NotesField = model.notes,
                phaseDescriptionField = model.phaseDescription,
                phaseFollowsField = model.phaseFollows.ToString (),
                phaseIDField = model.phaseID,
                phaseNameField = model.phaseName,
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
    }
}