namespace pghworks.Models {
    public class Drawdown {
        public string drawdownID { get; set; }
        public string parentID { get; set; }
        public string parentType { get; set; }
        public string fundID { get; set; }
        public int drawdownAmount { get; set; }
        public string drawdownType { get; set; }
        public string notes { get; set; }
        public string cartegraphID { get; set; }
    }

    public class CgDrawdown {
        public string drawdownIDField { get; set; }
        public string parentIDField { get; set; }
        public string parentTypeField { get; set; }
        public string fundIDField { get; set; }
        public int drawdownAmountField { get; set; }
        public string drawdownTypeField { get; set; }
        public string notesField { get; set; }
        public string Oid { get; set; }
    }
}