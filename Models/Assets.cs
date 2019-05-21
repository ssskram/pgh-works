namespace pghworks.Models
{
    public class TaggableAssets
    {
        public string assetType { get; set; }
        public string assetOID { get; set; }
        public string assetName { get; set; }
        public string neighborhood { get; set; }
        public string street { get; set; }
        public string misc { get; set; }
        public Shape shape { get; set; }
    }
}