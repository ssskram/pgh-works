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

namespace pghworks.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class subphases : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        public subphases(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        HttpClient client = new HttpClient();

        // GET
        [HttpGet("[action]")]
        public object loadSubphases()
        {
            List<Subphase> AllSubphases = new List<Subphase>();
            string cartSubphases = getSubphases().Result;
            dynamic cartSubphasesObject = JObject.Parse(cartSubphases)["cgTasksClass"];
            foreach (var item in cartSubphasesObject)
            {
                Subphase ph = new Subphase()
                {
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
                AllSubphases.Add(ph);
            }
            return AllSubphases;
        }
        public async Task<string> getSubphases()
        {
            var key = Environment.GetEnvironmentVariable("CartegraphAPIkey");
            var cartegraphUrl = "https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/classes/cgTasksClass?limit=10000&offset=0&filter=(([subphaseType] is equal to \"Subphase\"))";
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Basic", key);
            string content = await client.GetStringAsync(cartegraphUrl);
            return content;
        }

        // POST
        [HttpPost("[action]")]
        public async Task addSubphase([FromBody] Subphase model)
        {
            CgSubphase cgModel = new CgSubphase()
            {
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
            string cgLoad = JsonConvert.SerializeObject(cgModel);
            var key = Environment.GetEnvironmentVariable("CartegraphAPIkey");
            var cartegraphUrl = "https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/Classes/cgTasksClass";
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Add("X-HTTP-Method", "POST");
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Basic", key);
            string json = "{ 'cgTasksClass' : [" + cgLoad + "] }";
            client.DefaultRequestHeaders.Add("ContentLength", json.Length.ToString());
            try
            {
                StringContent strContent = new StringContent(json);
                strContent.Headers.ContentType = MediaTypeHeaderValue.Parse("application/json;odata=verbose");
                HttpResponseMessage response = client.PostAsync(cartegraphUrl, strContent).Result;
                response.EnsureSuccessStatusCode();
                var content = await response.Content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine(ex.Message);
            }
            await new log().postLog(_userManager.GetUserName(HttpContext.User), "Post", "Subphase", model.subphaseName, model.subphaseID);
        }

        // PuUT
        [HttpPut("[action]")]
        public async Task updateSubphase([FromBody] Subphase model)
        {
            var key = Environment.GetEnvironmentVariable("CartegraphAPIkey");
            string id;
            if (model.cartegraphID != null && model.cartegraphID != "")
            {
                id = model.cartegraphID;
            }
            else
            {
                var getURL =
                    String.Format("https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/classes/cgTasksClass?filter=(([subphaseID] is equal to \"{0}\"))",
                        model.subphaseID); // 0
                client.DefaultRequestHeaders.Clear();
                client.DefaultRequestHeaders.Authorization =
                    new AuthenticationHeaderValue("Basic", key);
                string content = await client.GetStringAsync(getURL);
                dynamic phase = JObject.Parse(content)["cgTasksClass"][0];
                id = phase.Oid;
            }
            CgSubphase cgModel = new CgSubphase()
            {
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
            string cgLoad = JsonConvert.SerializeObject(cgModel);
            var cartegraphUrl = String.Format("https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/Classes/cgTasksClass/");
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Add("X-HTTP-Method", "PUT");
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Basic", key);
            string json = "{ 'cgTasksClass' : [" + cgLoad + "] }";
            client.DefaultRequestHeaders.Add("ContentLength", json.Length.ToString());
            try
            {
                StringContent strContent = new StringContent(json);
                strContent.Headers.ContentType = MediaTypeHeaderValue.Parse("application/json;odata=verbose");
                HttpResponseMessage response = client.PutAsync(cartegraphUrl, strContent).Result;
                response.EnsureSuccessStatusCode();
                var content = await response.Content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine(ex.Message);
            }
            await new log().postLog(_userManager.GetUserName(HttpContext.User), "Put", "Subphase", model.subphaseName, model.subphaseID);
        }

        // DELETE
        [HttpDelete("[action]")]
        public async Task deleteSubphase([FromBody] Subphase model)
        {
            var key = Environment.GetEnvironmentVariable("CartegraphAPIkey");
            string id;
            if (model.cartegraphID != null && model.cartegraphID != "")
            {
                id = model.cartegraphID;
            }
            else
            {
                var getURL =
                    String.Format("https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/classes/cgTasksClass?filter=(([subphaseID] is equal to \"{0}\"))",
                        model.subphaseID); // 0
                client.DefaultRequestHeaders.Clear();
                client.DefaultRequestHeaders.Authorization =
                    new AuthenticationHeaderValue("Basic", key);
                string content = await client.GetStringAsync(getURL);
                dynamic subphase = JObject.Parse(content)["cgTasksClass"][0];
                id = subphase.Oid;
            }
            var deleteUrl =
                String.Format("https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/classes/cgTasksClass/{0}",
                    id); // 0
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Basic", key);
            try
            {
                await client.DeleteAsync(deleteUrl);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }
            await new log().postLog(_userManager.GetUserName(HttpContext.User), "Delete", "Subphase", model.subphaseName, model.subphaseID);
        }
    }
}