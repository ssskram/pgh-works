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
    public class funds : Controller {
        HttpClient client = new HttpClient ();

        // GET
        [HttpGet ("[action]")]
        public async Task<object> loadFunds () {
            var key = Environment.GetEnvironmentVariable ("CartegraphAPIkey");
            var cartegraphUrl = "https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/Classes/ProjectFundingSourcesClass?fields=Oid,fundAmountField,fundNameField,fundTypeField,fundYearField,expirationDateField";
            client.DefaultRequestHeaders.Clear ();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue ("Basic", key);
            string funds = await client.GetStringAsync (cartegraphUrl);
            dynamic fundObject = JObject.Parse (funds) ["ProjectFundingSourcesClass"];
            List<Fund> AllFunds = new List<Fund> ();
            foreach (var item in fundObject) {
                Fund fn = new Fund () {
                    fundID = item.Oid,
                    fundName = item.fundNameField,
                    fundYear = item.fundYearField,
                    fundType = item.fundTypeField,
                    expirationDate = item.expirationDateField,
                    fundAmount = item.fundAmountField
                };
                AllFunds.Add (fn);
            }
            return AllFunds;
        }
    }
}