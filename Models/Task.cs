namespace pghworks.Models
{
    public class Tasks
    {
        public string cartegraphID { get; set; }
        public string dateCompleted { get; set; }
        public string dueDate { get; set; }
        public string taskID { get; set; }
        public string taskName { get; set; }
        public int percentComplete { get; set; }
        public string phaseID { get; set; }
        public string projectID { get; set; }
        public string notes { get; set; }
    }

    public class CgTasks
    {
        public string Oid { get; set; }
        public string subphaseDateCompletedField { get; set; }
        public string subphaseDueDateField { get; set; }
        public string subphaseIDField { get; set; }
        public string taskNameField { get; set; }
        public int percentCompleteField { get; set; }
        public string phaseIDField { get; set; }
        public string projectIDField { get; set; }
        public string NotesField { get; set; }
        public string subphaseTypeField = "Task";

        // req fields, tasks class
        public string ActivityField = "Project Management";
        public string DepartmentField = "Administration";
        public string PriorityField = "None";
    }
}