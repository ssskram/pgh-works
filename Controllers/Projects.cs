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
    public class projects : Controller {
        HttpClient client = new HttpClient ();

        public class Project {
            public string actualEndDate { get; set; }
            public string actualStartDate { get; set; }
            public string cartegraphID { get; set; }
            public string created { get; set; }
            public string createdBy { get; set; }
            public string expectedStartDate { get; set; }
            public string expectedEndDate { get; set; }
            public string lastModifiedBy { get; set; }
            public string notes { get; set; }
            public string projectDepartment { get; set; }
            public string projectDescription { get; set; }
            public string projectID { get; set; }
            public string projectManager { get; set; }
            public string projectMembers { get; set; }
            public string projectName { get; set; }
            public string projectStatus { get; set; }
            public List<Shape> shape { get; set; }
        }

        public class Shape {
            public double lat { get; set; }
            public double lng { get; set; }
        }

        // GET
        [HttpGet ("[action]")]
        public object loadProjects () {
            string projects = System.IO.File.ReadAllText ("demoData/demoProjects.json");
            dynamic projectsObject = JObject.Parse (projects) ["projects"];
            List<Project> AllProjects = new List<Project> ();
            foreach (var item in projectsObject) {
                Project pj = new Project () {
                    cartegraphID = item.cartegraphID,
                    created = item.created,
                    createdBy = item.createdBy,
                    projectID = item.projectID,
                    lastModifiedBy = item.lastModifiedBy,
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
                    shape = item.shape.ToObject<List<Shape>> ()
                };
                AllProjects.Add(pj);
            }
            return AllProjects;
        }

    }
}