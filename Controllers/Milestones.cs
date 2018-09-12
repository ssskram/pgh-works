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
    public class milestones : Controller {
        HttpClient client = new HttpClient ();

        public class Milestone { 
            public string cartegraphID { get; set; }
            public string created { get; set; }
            public string createdBy { get; set; }
            public string dateCompleted { get; set; }
            public string dueDate { get; set; }
            public string milestoneID { get; set; }
            public string milestoneName { get; set; }
            public string percentComplete { get; set; }
            public string phaseID { get; set; }
            public string projectID { get; set; }
        }

        // GET
        [HttpGet ("[action]")]
        public object loadMilestones () {
            string milestones = System.IO.File.ReadAllText ("demoData/demoMilestones.json");
            dynamic milestonesObject = JObject.Parse (milestones) ["milestones"];
            List<Milestone> AllMilestones = new List<Milestone> ();
            foreach (var item in milestonesObject) {
                Milestone ms = new Milestone () {
                    cartegraphID = item.cartegraphID,
                    created = item.created,
                    createdBy = item.createdBy,
                    dateCompleted = item.dateCompleted,
                    dueDate = item.dueDate,
                    milestoneID = item.milestoneID,
                    milestoneName = item.milestoneName,
                    percentComplete = item.percentComplete,
                    phaseID = item.phaseID,
                    projectID = item.projectID
                };
                AllMilestones.Add(ms);
            }
            return AllMilestones;
        }

    }
}