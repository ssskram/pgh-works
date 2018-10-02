namespace pghworks.Models {
    public class Tag {
        public string cartegraphID { get; set; }
        public string parentID { get; set; }
        public string parentName { get; set; }
        public string parentType { get; set; }
        public string tagDescription { get; set; }
        public string tagID { get; set; }
        public string tagType { get; set; }
        public string taggedAssetName { get; set; }
        public string taggedAssetOID { get; set; }
    }

    public class CgTag {
        public string parentIDField { get; set; }
        public string parentNameField { get; set; }
        public string parentTypeField { get; set; }
        public string tagDescriptionField { get; set; }
        public string taggedAssetNameField { get; set; }
        public string taggedAssetOIDField { get; set; }
        public string tagTypeField { get; set; }
        public string tagIDField { get; set; }
        public string Oid { get; set; }
    }
}