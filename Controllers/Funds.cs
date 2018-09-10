using System;
using System.Collections.Generic;
using System.Collections.Specialized;
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
    public class funds : Controller {
        HttpClient client = new HttpClient ();

        public class Fund {
            public string fundID { get; set; }
            public string fundName { get; set; }
            public string fundYear { get; set; }
            public string fundType { get; set; }
            public string expirationDate { get; set; }
            public string fundAmount { get; set; }
        }

        // GET
        [HttpGet ("[action]")]
        public async Task<object> loadFunds () {
            string funds = System.IO.File.ReadAllText ("demoFunds.json");
            dynamic fundObject = JObject.Parse (funds) ["funds"];
            List<Fund> AllFunds = new List<Fund> ();
            foreach (var item in fundObject) {
                Fund fn = new Fund () {
                    fundID = item.fundID,
                    fundName = item.fundName,
                    fundYear = item.fundYear,
                    fundType = item.fundType,
                    expirationDate = item.expirationDate,
                    fundAmount = item.fundAmount
                };
                AllFunds.Add(fn);
            }
            await Task.Delay(1);
            return AllFunds;
        }
    }
}