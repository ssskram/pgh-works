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
    public class phases : Controller {
        HttpClient client = new HttpClient ();

        public class Phase {
            public string actualEndDate { get; set; }
            public string actualStartDate { get; set; }
            public string cartegraphID { get; set; }
            public string created { get; set; }
            public string expectedEndDate { get; set; }
            public string expectedStartDate { get; set; }
            public string notes { get; set; }
            public string phaseDescription { get; set; }
            public string phaseFollows { get; set; }
            public string phaseID { get; set; }
            public string phaseName { get; set; }
            public string phaseStatus { get; set; }
            public string projectID { get; set; }

        }

        // GET
        [HttpGet ("[action]")]
        public object loadPhases () {
            string phases = System.IO.File.ReadAllText ("demoData/demoPhases.json");
            dynamic phasesObject = JObject.Parse (phases) ["phases"];
            List<Phase> AllPhases = new List<Phase> ();
            foreach (var item in phasesObject) {
                Phase ph = new Phase () {
                    actualEndDate = item.actualEndDate,
                    actualStartDate = item.actualStartDate,
                    cartegraphID = item.cartegraphID,
                    created = item.created,
                    expectedEndDate = item.expectedEndDate,
                    expectedStartDate = item.expectedStartDate,
                    notes = item.notes,
                    phaseDescription = item.phaseDescription,
                    phaseFollows = item.phaseFollows,
                    phaseID = item.phaseID,
                    phaseName = item.phaseName,
                    phaseStatus = item.phaseStatus,
                    projectID = item.projectID
                };
                AllPhases.Add(ph);
            }
            return AllPhases;
        }

    }
}