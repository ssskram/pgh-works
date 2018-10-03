

export default function filterProjects(projects, personnel, user, filters, type) {
    let filteredProjects = [] as any
    if (type ==  "all") {
        filteredProjects = applyFilter(projects, filters)
    } else {
        const me = personnel.find(person => {
            return person.email == user
        })
        const myProjects = projects.filter(project => {
            return (project.projectManager.includes(me.title) || project.projectMembers.includes(me.title))
        })
        filteredProjects = applyFilter(myProjects, filters)
    }
    return filteredProjects
}

export function applyFilter (projects, filters) {
    const filtered = projects.filter(project => {
        if (filters.projectName) {
            if (!project.projectName.toLowerCase().includes(filters.projectName.toLowerCase())) {
                return false
            }
        }
        if (filters.projectDepartment) {
            if (!project.projectDepartment.toLowerCase().includes(filters.projectDepartment.toLowerCase())) {
                return false
            }
        }
        if (filters.projectStatus) {
            if (!project.projectStatus.toLowerCase().includes(filters.projectStatus.toLowerCase())) {
                return false
            }
        }
        if (filters.projectManager) {
            if (!project.projectManager.toLowerCase().includes(filters.projectManager.toLowerCase())) {
                return false
            }
        }
        // if (filters.startDate) {

        // }
        // if (filters.endDate) {

        // }
        return true
    })
    return filtered
}
