namespace pghworks.Models {
    public class Drawdown {
        public string drawdownID { get; set; }
        public string parentID { get; set; }
        public string parentType { get; set; }
        public string fundID { get; set; }
        public string drawdownAmount { get; set; }
        public string drawdownType { get; set; }
        public string notes { get; set; }
        public string spID { get; set; }
    }
}