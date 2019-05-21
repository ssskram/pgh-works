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
    public class tasks : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        public tasks(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        HttpClient client = new HttpClient();

        // GET
        [HttpGet("[action]")]
        public object loadTasks()
        {
            List<Tasks> AllTasks = new List<Tasks>();
            string cartTasks = getTasks().Result;
            dynamic cartTasksObject = JObject.Parse(cartTasks)["cgTasksClass"];
            foreach (var item in cartTasksObject)
            {
                Tasks ph = new Tasks()
                {
                    cartegraphID = item.Oid,
                    dateCompleted = item.subphaseDateCompletedField,
                    dueDate = item.subphaseDueDateField,
                    taskID = item.subphaseIDField,
                    taskName = item.taskNameField,
                    percentComplete = item.percentCompleteField,
                    phaseID = item.phaseIDField,
                    projectID = item.projectIDField,
                    notes = item.NotesField
                };
                AllTasks.Add(ph);
            }
            return AllTasks;
        }
        public async Task<string> getTasks()
        {
            var key = Environment.GetEnvironmentVariable("CartegraphAPIkey");
            var cartegraphUrl = "https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/classes/cgTasksClass?limit=10000&offset=0&filter=(([subphaseType] is equal to \"Task\"))";
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Basic", key);
            string content = await client.GetStringAsync(cartegraphUrl);
            return content;
        }

        // POST
        [HttpPost("[action]")]
        public async Task addTask([FromBody] Tasks model)
        {
            CgTasks cgModel = new CgTasks()
            {
                subphaseDateCompletedField = model.dateCompleted,
                subphaseDueDateField = model.dueDate,
                subphaseIDField = model.taskID,
                taskNameField = model.taskName,
                percentCompleteField = model.percentComplete,
                phaseIDField = model.phaseID,
                projectIDField = model.projectID,
                NotesField = model.notes
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
            await new log().postLog(_userManager.GetUserName(HttpContext.User), "Post", "Task", model.taskName, model.taskID);
        }

        // PUT
        [HttpPut("[action]")]
        public async Task updateTask([FromBody] Tasks model)
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
                        model.taskID); // 0
                client.DefaultRequestHeaders.Clear();
                client.DefaultRequestHeaders.Authorization =
                    new AuthenticationHeaderValue("Basic", key);
                string content = await client.GetStringAsync(getURL);
                dynamic task = JObject.Parse(content)["cgTasksClass"][0];
                id = task.Oid;
            }
            CgTasks cgModel = new CgTasks()
            {
                Oid = id,
                subphaseDateCompletedField = model.dateCompleted,
                subphaseDueDateField = model.dueDate,
                subphaseIDField = model.taskID,
                taskNameField = model.taskName,
                percentCompleteField = model.percentComplete,
                phaseIDField = model.phaseID,
                projectIDField = model.projectID,
                NotesField = model.notes
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
            await new log().postLog(_userManager.GetUserName(HttpContext.User), "Put", "Task", model.taskName, model.taskID);
        }

        // DELETE
        [HttpDelete("[action]")]
        public async Task deleteTask([FromBody] Tasks model)
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
                        model.taskID); // 0
                client.DefaultRequestHeaders.Clear();
                client.DefaultRequestHeaders.Authorization =
                    new AuthenticationHeaderValue("Basic", key);
                string content = await client.GetStringAsync(getURL);
                dynamic task = JObject.Parse(content)["cgTasksClass"][0];
                id = task.Oid;
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
            await new log().postLog(_userManager.GetUserName(HttpContext.User), "Delete", "Task", model.taskName, model.taskID);
        }
    }
}