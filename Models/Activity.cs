namespace pghworks.Models
{
    public class Activities
    {
        public string cartegraphID { get; set; }
        public string activityID { get; set; }
        public string user { get; set; }
        public string activity { get; set; }
        public string date { get; set; }
        public string parentID { get; set; }
        public string parentType { get; set; }
    }

    public class CgActivity
    {
        public string Oid { get; set; }
        public string activityIDField { get; set; }
        public string userIDField { get; set; }
        public string activityField { get; set; }
        public string activityDateField { get; set; }
        public string parentIDField { get; set; }
        public string parentTypeField { get; set; }
    }
}