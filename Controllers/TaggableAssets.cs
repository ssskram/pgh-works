using System;
using System.Collections.Generic;
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
    public class assets : Controller {
        HttpClient client = new HttpClient ();

        // empty list to write all assets
        List<TaggableAssets> AllAssets = new List<TaggableAssets> ();

        // GET
        [HttpGet ("[action]")]
        public async Task<object> loadTaggableAssets () {
            await getFacilities ();
            await getProjects();
            await getSteps();
            await getRetainingWalls();
            await getPools();
            await getPlaygrounds();
            await getParks();
            await getIntersections();
            await getBridges();
            return AllAssets;
        }

        public async Task getFacilities () {
            var key = Environment.GetEnvironmentVariable ("CartegraphAPIkey");
            var cartegraphUrl = "https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/Classes/cgFacilitiesClass?fields=Oid,CgShape,IDField";
            client.DefaultRequestHeaders.Clear ();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue ("Basic", key);
            string content = await client.GetStringAsync (cartegraphUrl);
            dynamic facilities = JObject.Parse (content) ["cgFacilitiesClass"];
            foreach (var item in facilities) {
                TaggableAssets ta = new TaggableAssets () {
                    assetType = "Facility",
                    assetOID = item.Oid,
                    assetName = item.IDField,
                    shape = item.CgShape.ToObject<Shape> ()
                };
                AllAssets.Add (ta);
            }
        }

        public async Task getProjects () {
            var key = Environment.GetEnvironmentVariable ("CartegraphAPIkey");
            var cartegraphUrl = "https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/Classes/ProjectsClass?fields=Oid,CgShape,projectNameField";
            client.DefaultRequestHeaders.Clear ();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue ("Basic", key);
            string content = await client.GetStringAsync (cartegraphUrl);
            dynamic projects = JObject.Parse (content) ["ProjectsClass"];
            foreach (var item in projects) {
                TaggableAssets ta = new TaggableAssets () {
                    assetType = "Project",
                    assetOID = item.Oid,
                    assetName = item.projectNameField,
                    shape = item.CgShape.ToObject<Shape> ()
                };
                AllAssets.Add (ta);
            }
        }

        public async Task getSteps () {
            var key = Environment.GetEnvironmentVariable ("CartegraphAPIkey");
            var cartegraphUrl = "https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/Classes/StepsClass?fields=Oid,CgShape,IDField";
            client.DefaultRequestHeaders.Clear ();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue ("Basic", key);
            string content = await client.GetStringAsync (cartegraphUrl);
            dynamic steps = JObject.Parse (content) ["StepsClass"];
            foreach (var item in steps) {
                TaggableAssets ta = new TaggableAssets () {
                    assetType = "Steps",
                    assetOID = item.Oid,
                    assetName = item.IDField,
                    shape = item.CgShape.ToObject<Shape> ()
                };
                AllAssets.Add (ta);
            }
        }

        public async Task getRetainingWalls () {
            var key = Environment.GetEnvironmentVariable ("CartegraphAPIkey");
            var cartegraphUrl = "https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/Classes/RetainingWallClass?fields=Oid,CgShape,IDField";
            client.DefaultRequestHeaders.Clear ();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue ("Basic", key);
            string content = await client.GetStringAsync (cartegraphUrl);
            dynamic walls = JObject.Parse (content) ["RetainingWallClass"];
            foreach (var item in walls) {
                TaggableAssets ta = new TaggableAssets () {
                    assetType = "Retaining Wall",
                    assetOID = item.Oid,
                    assetName = item.IDField,
                    shape = item.CgShape.ToObject<Shape> ()
                };
                AllAssets.Add (ta);
            }
        }

        public async Task getPools () {
            var key = Environment.GetEnvironmentVariable ("CartegraphAPIkey");
            var cartegraphUrl = "https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/Classes/PoolsClass?fields=Oid,CgShape,IDField";
            client.DefaultRequestHeaders.Clear ();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue ("Basic", key);
            string content = await client.GetStringAsync (cartegraphUrl);
            dynamic pools = JObject.Parse (content) ["PoolsClass"];
            foreach (var item in pools) {
                TaggableAssets ta = new TaggableAssets () {
                    assetType = "Pool",
                    assetOID = item.Oid,
                    assetName = item.IDField,
                    shape = item.CgShape.ToObject<Shape> ()
                };
                AllAssets.Add (ta);
            }
        }

        public async Task getPlaygrounds () {
            var key = Environment.GetEnvironmentVariable ("CartegraphAPIkey");
            var cartegraphUrl = "https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/Classes/PlaygroundsClass?fields=Oid,CgShape,IDField";
            client.DefaultRequestHeaders.Clear ();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue ("Basic", key);
            string content = await client.GetStringAsync (cartegraphUrl);
            dynamic playgrounds = JObject.Parse (content) ["PlaygroundsClass"];
            foreach (var item in playgrounds) {
                TaggableAssets ta = new TaggableAssets () {
                    assetType = "Playground",
                    assetOID = item.Oid,
                    assetName = item.IDField,
                    shape = item.CgShape.ToObject<Shape> ()
                };
                AllAssets.Add (ta);
            }
        }

        public async Task getParks () {
            var key = Environment.GetEnvironmentVariable ("CartegraphAPIkey");
            var cartegraphUrl = "https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/Classes/ParksClass?fields=Oid,CgShape,IDField";
            client.DefaultRequestHeaders.Clear ();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue ("Basic", key);
            string content = await client.GetStringAsync (cartegraphUrl);
            dynamic parks = JObject.Parse (content) ["ParksClass"];
            foreach (var item in parks) {
                TaggableAssets ta = new TaggableAssets () {
                    assetType = "Park",
                    assetOID = item.Oid,
                    assetName = item.IDField,
                    shape = item.CgShape.ToObject<Shape> ()
                };
                AllAssets.Add (ta);
            }
        }

        public async Task getIntersections () {
            var key = Environment.GetEnvironmentVariable ("CartegraphAPIkey");
            var cartegraphUrl = "https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/Classes/cgSignalizedIntersectionsClass?fields=Oid,CgShape,DescriptionField";
            client.DefaultRequestHeaders.Clear ();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue ("Basic", key);
            string content = await client.GetStringAsync (cartegraphUrl);
            dynamic intersections = JObject.Parse (content) ["cgSignalizedIntersectionsClass"];
            foreach (var item in intersections) {
                TaggableAssets ta = new TaggableAssets () {
                    assetType = "Intersection",
                    assetOID = item.Oid,
                    assetName = item.DescriptionField,
                    shape = item.CgShape.ToObject<Shape> ()
                };
                AllAssets.Add (ta);
            }
        }

        public async Task getBridges () {
            var key = Environment.GetEnvironmentVariable ("CartegraphAPIkey");
            var cartegraphUrl = "https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/Classes/cgBridgesClass?fields=Oid,CgShape,IDField";
            client.DefaultRequestHeaders.Clear ();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue ("Basic", key);
            string content = await client.GetStringAsync (cartegraphUrl);
            dynamic bridges = JObject.Parse (content) ["cgBridgesClass"];
            foreach (var item in bridges) {
                TaggableAssets ta = new TaggableAssets () {
                    assetType = "Bridge",
                    assetOID = item.Oid,
                    assetName = item.IDField,
                    shape = item.CgShape.ToObject<Shape> ()
                };
                AllAssets.Add (ta);
            }
        }
    }
}