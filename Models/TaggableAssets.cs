using System.Collections.Generic;

namespace pghworks.Models {
    public class TaggableAssets {
        public string assetType { get; set; }
        public string assetOID { get; set; }
        public string assetName { get; set; }
        public Shape shape { get; set; }
    }

    public class Shape {
        public List<Points> Points { get; set; }
    }

    public class Points {
        public string Lat { get; set; }
        public string Lng { get; set; }
    }
}