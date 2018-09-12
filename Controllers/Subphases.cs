using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using pghworks.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace pghworks.Controllers {
    [Authorize]
    [Route ("api/[controller]")]
    public class subphases : Controller {
        HttpClient client = new HttpClient ();

        public class Subphase {
            public string cartegraphID { get; set; }
            public string created { get; set; }
            public string createdBy { get; set; }
            public string endDate { get; set; }
            public string lastModifiedBy { get; set; }
            public string notes { get; set; }
            public string percentComplete { get; set; }
            public string phaseID { get; set; }
            public string projectID { get; set; }
            public string startDate { get; set; }
            public string subphaseDescription { get; set; }
            public string subphaseID { get; set; }
            public string subphaseName { get; set; }
            public string subphaseStatus { get; set; }

        }
        // GET
        [HttpGet ("[action]")]
        public object loadSubphases () {
            string subphases = System.IO.File.ReadAllText ("demoData/demoSubphases.json");
            dynamic subphasesObject = JObject.Parse (subphases) ["subphases"];
            List<Subphase> AllSubphases = new List<Subphase> ();
            foreach (var item in subphasesObject) {
                Subphase sp = new Subphase () {
                    cartegraphID = item.cartegraphID,
                    created = item.created,
                    createdBy = item.createdBy,
                    percentComplete = item.percentComplete,
                    phaseID = item.phaseID,
                    projectID = item.projectID,
                    endDate = item.endDate,
                    lastModifiedBy = item.lastModifiedBy,
                    notes = item.notes,
                    startDate = item.startDate,
                    subphaseDescription = item.subphaseDescription,
                    subphaseID = item.subphaseID,
                    subphaseName = item.subphaseName,
                    subphaseStatus = item.subphaseStatus
                };
                AllSubphases.Add(sp);
            }
            return AllSubphases;
        }

    }
}