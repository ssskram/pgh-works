namespace pghworks.Models {
    public class Phase {
        public string actualEndDate { get; set; }
        public string actualStartDate { get; set; }
        public string cartegraphID { get; set; }
        public string expectedEndDate { get; set; }
        public string expectedStartDate { get; set; }
        public string notes { get; set; }
        public string phaseDescription { get; set; }
        public string phaseID { get; set; }
        public string phaseName { get; set; }
        public string phaseStatus { get; set; }
        public string projectID { get; set; }
    }
    
    public class CgPhase {
        public string phaseActualEndDateField { get; set; }
        public string phaseActualStartDateField { get; set; }
        public string Oid { get; set; }
        public string phaseExpectedEndDateField { get; set; }
        public string phaseExpectedStartDateField { get; set; }
        public string NotesField { get; set; }
        public string phaseDescriptionField { get; set; }
        public string phaseIDField { get; set; }
        public string phaseNameField { get; set; }
        public string phaseStatusField { get; set; }
        public string projectIDField { get; set; }
        public string PriorityField = "None";
    }
}