using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using pghworks.Models;

namespace pghworks.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class assets : Controller
    {

        HttpClient client = new HttpClient();

        // empty list to write all assets
        List<TaggableAssets> AllAssets = new List<TaggableAssets>();

        // GET
        [HttpGet("[action]")]
        public async Task<object> loadTaggableAssets()
        {
            Task parks = getParks();
            Task streets = getStreetsRecursively();
            await getFacilities();
            await getProjects();
            await getSteps();
            await getRetainingWalls();
            await getPools();
            await getPlaygrounds();
            await getIntersections();
            await getBridges();
            await getFields();
            await getCourts();
            await parks;
            await streets;
            return AllAssets;
        }

        public async Task getFacilities()
        {
            var key = Environment.GetEnvironmentVariable("CartegraphAPIkey");
            var cartegraphUrl = "https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/Classes/cgFacilitiesClass?fields=Oid,CgShape,IDField,InactiveField,NeighborhoodField,StreetField&filter=(([Inactive] is equal to false))";
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Basic", key);
            string content = await client.GetStringAsync(cartegraphUrl);
            dynamic facilities = JObject.Parse(content)["cgFacilitiesClass"];
            foreach (var item in facilities)
            {
                TaggableAssets ta = new TaggableAssets()
                {
                    assetType = "Facility",
                    assetOID = item.Oid,
                    assetName = item.IDField,
                    neighborhood = item.NeighborhoodField,
                    street = item.StreetField,
                    misc = item.FacilityTypeField,
                    shape = item.CgShape.ToObject<Shape>()
                };
                AllAssets.Add(ta);
            }
        }

        public async Task getProjects()
        {
            var key = Environment.GetEnvironmentVariable("CartegraphAPIkey");
            var cartegraphUrl = "https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/Classes/ProjectsClass?fields=Oid,CgShape,projectNameField,InactiveField,projectDescriptionField&filter=(([Inactive] is equal to false))";
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Basic", key);
            string content = await client.GetStringAsync(cartegraphUrl);
            dynamic projects = JObject.Parse(content)["ProjectsClass"];
            foreach (var item in projects)
            {
                TaggableAssets ta = new TaggableAssets()
                {
                    assetType = "Project",
                    assetOID = item.Oid,
                    assetName = item.projectNameField,
                    misc = item.projectDescriptionField,
                    shape = item.CgShape.ToObject<Shape>()
                };
                AllAssets.Add(ta);
            }
        }

        public async Task getSteps()
        {
            var key = Environment.GetEnvironmentVariable("CartegraphAPIkey");
            var cartegraphUrl = "https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/Classes/StepsClass?fields=Oid,CgShape,IDField,InactiveField,StreetField,NeighborhoodField&filter=(([Inactive] is equal to false))";
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Basic", key);
            string content = await client.GetStringAsync(cartegraphUrl);
            dynamic steps = JObject.Parse(content)["StepsClass"];
            foreach (var item in steps)
            {
                TaggableAssets ta = new TaggableAssets()
                {
                    assetType = "Steps",
                    assetOID = item.Oid,
                    assetName = item.IDField,
                    street = item.StreetField,
                    neighborhood = item.NeighborhoodField,

                    shape = item.CgShape.ToObject<Shape>()
                };
                AllAssets.Add(ta);
            }
        }

        public async Task getRetainingWalls()
        {
            var key = Environment.GetEnvironmentVariable("CartegraphAPIkey");
            var cartegraphUrl = "https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/Classes/RetainingWallClass?fields=Oid,CgShape,IDField,InactiveField,NeighborhoodField,StreetField&filter=(([Inactive] is equal to false))";
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Basic", key);
            string content = await client.GetStringAsync(cartegraphUrl);
            dynamic walls = JObject.Parse(content)["RetainingWallClass"];
            foreach (var item in walls)
            {
                TaggableAssets ta = new TaggableAssets()
                {
                    assetType = "Retaining Wall",
                    assetOID = item.Oid,
                    assetName = item.IDField,
                    neighborhood = item.NeighborhoodField,
                    street = item.StreetField,
                    shape = item.CgShape.ToObject<Shape>()
                };
                AllAssets.Add(ta);
            }
        }

        public async Task getPools()
        {
            var key = Environment.GetEnvironmentVariable("CartegraphAPIkey");
            var cartegraphUrl = "https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/Classes/PoolsClass?fields=Oid,CgShape,IDField,InactiveField,NeighborhoodField,StreetField,ParkField&filter=(([Inactive] is equal to false))";
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Basic", key);
            string content = await client.GetStringAsync(cartegraphUrl);
            dynamic pools = JObject.Parse(content)["PoolsClass"];
            foreach (var item in pools)
            {
                TaggableAssets ta = new TaggableAssets()
                {
                    assetType = "Pool",
                    assetOID = item.Oid,
                    assetName = item.IDField,
                    neighborhood = item.NeighborhoodField,
                    street = item.StreetField,
                    misc = item.ParkField,
                    shape = item.CgShape.ToObject<Shape>()
                };
                AllAssets.Add(ta);
            }
        }

        public async Task getPlaygrounds()
        {
            var key = Environment.GetEnvironmentVariable("CartegraphAPIkey");
            var cartegraphUrl = "https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/Classes/PlaygroundsClass?fields=Oid,CgShape,IDField,InactiveField,NeighborhoodField,StreetField,ParkField&filter=(([Inactive] is equal to false))";
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Basic", key);
            string content = await client.GetStringAsync(cartegraphUrl);
            dynamic playgrounds = JObject.Parse(content)["PlaygroundsClass"];
            foreach (var item in playgrounds)
            {
                TaggableAssets ta = new TaggableAssets()
                {
                    assetType = "Playground",
                    assetOID = item.Oid,
                    assetName = item.IDField,
                    neighborhood = item.NeighborhoodField,
                    street = item.StreetField,
                    misc = item.ParkField,
                    shape = item.CgShape.ToObject<Shape>()
                };
                AllAssets.Add(ta);
            }
        }

        public async Task getParks()
        {
            var key = Environment.GetEnvironmentVariable("CartegraphAPIkey");
            var cartegraphUrl = "https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/Classes/ParksClass?fields=Oid,CgShape,IDField,InactiveField,NeighborhoodField,StreetField&filter=(([Inactive] is equal to false))";
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Basic", key);
            string content = await client.GetStringAsync(cartegraphUrl);
            dynamic parks = JObject.Parse(content)["ParksClass"];

            foreach (var item in parks)
            {
                var breaks = item.CgShape.Breaks.ToString();
                if (breaks == null || breaks == "[]")
                {
                    TaggableAssets ta = new TaggableAssets()
                    {
                        assetType = "Park",
                        assetOID = item.Oid,
                        assetName = item.IDField,
                        neighborhood = item.NeighborhoodField,
                        street = item.StreetField,
                        shape = item.CgShape.ToObject<Shape>()
                    };
                    AllAssets.Add(ta);
                }
                else
                {
                    var shape = item.CgShape.ToObject<Shape>();
                    Shape hull = new Shape();
                    hull.Points = GetConvexHull(shape.Points);
                    TaggableAssets ta = new TaggableAssets()
                    {
                        assetType = "Park",
                        assetOID = item.Oid,
                        neighborhood = item.NeighborhoodField,
                        street = item.StreetField,
                        assetName = item.IDField,
                        shape = hull
                    };
                    AllAssets.Add(ta);
                }
            }
        }

        public async Task getIntersections()
        {
            var key = Environment.GetEnvironmentVariable("CartegraphAPIkey");
            var cartegraphUrl = "https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/Classes/cgSignalizedIntersectionsClass?fields=Oid,CgShape,DescriptionField,InactiveField,NeighborhoodField,StreetField&filter=(([Inactive] is equal to false))";
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Basic", key);
            string content = await client.GetStringAsync(cartegraphUrl);
            dynamic intersections = JObject.Parse(content)["cgSignalizedIntersectionsClass"];
            foreach (var item in intersections)
            {
                TaggableAssets ta = new TaggableAssets()
                {
                    assetType = "Intersection",
                    assetOID = item.Oid,
                    assetName = item.DescriptionField,
                    neighborhood = item.NeighborhoodField,
                    street = item.StreetField,
                    shape = item.CgShape.ToObject<Shape>()
                };
                AllAssets.Add(ta);
            }
        }

        public async Task getBridges()
        {
            var key = Environment.GetEnvironmentVariable("CartegraphAPIkey");
            var cartegraphUrl = "https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/Classes/cgBridgesClass?fields=Oid,CgShape,IDField,InactiveField,NeighborhoodField,StreetField&filter=(([Inactive] is equal to false))";
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Basic", key);
            string content = await client.GetStringAsync(cartegraphUrl);
            dynamic bridges = JObject.Parse(content)["cgBridgesClass"];
            foreach (var item in bridges)
            {
                TaggableAssets ta = new TaggableAssets()
                {
                    assetType = "Bridge",
                    assetOID = item.Oid,
                    assetName = item.IDField,
                    neighborhood = item.NeighborhoodField,
                    street = item.StreetField,
                    shape = item.CgShape.ToObject<Shape>()
                };
                AllAssets.Add(ta);
            }
        }

        public async Task getFields()
        {
            var key = Environment.GetEnvironmentVariable("CartegraphAPIkey");
            var cartegraphUrl = "https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/Classes/PlayingFieldsClass?fields=Oid,CgShape,IDField,InactiveField,NeighborhoodField,StreetField,ParkField&filter=(([Inactive] is equal to false))";
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Basic", key);
            string content = await client.GetStringAsync(cartegraphUrl);
            dynamic fields = JObject.Parse(content)["PlayingFieldsClass"];
            foreach (var item in fields)
            {
                TaggableAssets ta = new TaggableAssets()
                {
                    assetType = "Playing Field",
                    assetOID = item.Oid,
                    assetName = item.IDField,
                    neighborhood = item.NeighborhoodField,
                    street = item.StreetField,
                    misc = item.ParkField,
                    shape = item.CgShape.ToObject<Shape>()
                };
                AllAssets.Add(ta);
            }
        }

        public async Task getCourts()
        {
            var key = Environment.GetEnvironmentVariable("CartegraphAPIkey");
            var cartegraphUrl = "https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/Classes/CourtsClass?fields=Oid,CgShape,IDField,InactiveField,ParkField,CourtTypeField&filter=(([Inactive] is equal to false))";
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Basic", key);
            string content = await client.GetStringAsync(cartegraphUrl);
            dynamic courts = JObject.Parse(content)["CourtsClass"];
            foreach (var item in courts)
            {
                TaggableAssets ta = new TaggableAssets()
                {
                    assetType = "Court",
                    assetOID = item.Oid,
                    assetName = item.IDField,
                    neighborhood = item.ParkField,
                    misc = item.CourtTypeField,
                    shape = item.CgShape.ToObject<Shape>()
                };
                AllAssets.Add(ta);
            }
        }

        public async Task getStreetsRecursively()
        {
            var offset = 0;
            var url = "https://cgweb06.cartegraphoms.com/PittsburghPA/api/v1/Classes/cgPavementClass?fields=Oid,CgShape,StreetField,InactiveField,HOODRIGHTField&filter=(([Inactive] is equal to false))&limit=1000";
            await getStreets(url, offset);
        }

        List<TaggableAssets> AllStreetSegments = new List<TaggableAssets>();
        public async Task getStreets(string url, int offset)
        {
            var key = Environment.GetEnvironmentVariable("CartegraphAPIkey");
            var cartegraphUrl = url + "&offset=" + offset;
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Basic", key);
            string content = await client.GetStringAsync(cartegraphUrl);
            dynamic streets = JObject.Parse(content)["cgPavementClass"];
            if (streets.Count > 0)
            {
                foreach (var item in streets)
                {
                    TaggableAssets ta = new TaggableAssets()
                    {
                        assetType = "Street",
                        assetOID = item.Oid,
                        assetName = item.StreetField,
                        neighborhood = item.HOODRIGHTField,
                        shape = item.CgShape.ToObject<Shape>()
                    };
                    AllAssets.Add(ta);
                }
                offset = offset + 1000;
                await getStreets(url, offset);
            }
            else return;
        }

        // calculating convex hull for park shapes
        public static double cross(Points O, Points A, Points B)
        {
            return (A.Lat - O.Lat) * (B.Lng - O.Lng) - (A.Lng - O.Lng) * (B.Lat - O.Lat);
        }

        public static List<Points> GetConvexHull(List<Points> points)
        {
            if (points == null)
                return null;

            if (points.Count() <= 1)
                return points;

            int n = points.Count(), k = 0;
            List<Points> H = new List<Points>(new Points[2 * n]);

            points.Sort((a, b) =>
               a.Lat == b.Lat ? a.Lng.CompareTo(b.Lng) : a.Lat.CompareTo(b.Lat));

            // Build lower hull
            for (int i = 0; i < n; ++i)
            {
                while (k >= 2 && cross(H[k - 2], H[k - 1], points[i]) <= 0)
                    k--;
                H[k++] = points[i];
            }

            // Build upper hull
            for (int i = n - 2, t = k + 1; i >= 0; i--)
            {
                while (k >= t && cross(H[k - 2], H[k - 1], points[i]) <= 0)
                    k--;
                H[k++] = points[i];
            }

            return H.Take(k - 1).ToList();
        }
    }
}