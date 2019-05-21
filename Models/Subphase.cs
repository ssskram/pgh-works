namespace pghworks.Models
{
    public class Subphase
    {
        public string cartegraphID { get; set; }
        public string endDate { get; set; }
        public string notes { get; set; }
        public int percentComplete { get; set; }
        public string phaseID { get; set; }
        public string projectID { get; set; }
        public string startDate { get; set; }
        public string subphaseDescription { get; set; }
        public string subphaseID { get; set; }
        public string subphaseName { get; set; }
        public string subphaseStatus { get; set; }
    }

    public class CgSubphase
    {
        public string Oid { get; set; }
        public string subphaseStartDateField { get; set; }
        public string subphaseEndDateField { get; set; }
        public int percentCompleteField { get; set; }
        public string NotesField { get; set; }
        public string phaseIDField { get; set; }
        public string projectIDField { get; set; }
        public string TaskDescriptionField { get; set; }
        public string subphaseIDField { get; set; }
        public string taskNameField { get; set; }
        public string SubPhaseStatusField { get; set; }
        public string subphaseTypeField = "Subphase";

        // req fields, tasks class
        public string ActivityField = "Project Management";
        public string DepartmentField = "Administration";
        public string PriorityField = "None";
    }
}