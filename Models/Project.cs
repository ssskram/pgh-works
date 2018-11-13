namespace pghworks.Models {
    public class Project {
        public string actualEndDate { get; set; }
        public string actualStartDate { get; set; }
        public string cartegraphID { get; set; }
        public string expectedStartDate { get; set; }
        public string expectedEndDate { get; set; }
        public string notes { get; set; }
        public string projectDepartment { get; set; }
        public string projectDescription { get; set; }
        public string projectID { get; set; }
        public string projectManager { get; set; }
        public string projectMembers { get; set; }
        public string projectName { get; set; }
        public string projectStatus { get; set; }
        public Shape shape { get; set; }
    }

    public class CgProject {
        public string projectEndDateField { get; set; }
        public string projectStartDateField { get; set; }
        public string Oid { get; set; }
        public string expectedStartDateField { get; set; }
        public string expectedEndDateField { get; set; }
        public string projectNotesField { get; set; }
        public string projectDepartmentField { get; set; }
        public string projectDescriptionField { get; set; }
        public string projectIDField { get; set; }
        public string projectManagerField { get; set; }
        public string projectMembersField { get; set; }
        public string projectNameField { get; set; }
        public string projectStatusField { get; set; }
        public Shape CgShape { get; set; }
    }
}