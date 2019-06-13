// activity filter

export default function filterActivity(activity, projects, filters) {
  const filtered = activity.filter(ac => {
    if (filters.user) {
      // return all activity from user
      if (!ac.user.includes(filters.user)) return false;
    }
    if (filters.date) {
      // return all activity on date
      if (!ac.date.includes(filters.date)) return false;
    }
    if (filters.project) {
      // return all activity from project
      const project = projects.find(
        project => project.projectID == ac.parentID
      );
      if (!project.projectName.includes(filters.project)) return false;
    }
    return true;
  });
  return filtered;
}
