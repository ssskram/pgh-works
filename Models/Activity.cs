namespace pghworks.Models {
    public class Activities {
        public string cartegraphID { get; set; }
        public string activityID { get; set; }
        public string user { get; set; }
        public string activity { get; set; }
        public string date { get; set; }
    }

    public class CgActivity {
        public string Oid { get; set; }
        public string activityIDField { get; set; }
        public string userField { get; set; }
        public string activityField { get; set; }
        public string dateField { get; set; }
    }
}