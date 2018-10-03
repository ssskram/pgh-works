import * as moment from 'moment'

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
        if (filters.startDate) {
            if (project.actualStartDate && project.actualEndDate) {
                const start = moment(project.actualStartDate)
                const end = moment(project.actualEndDate)
                const target = moment(filters.startDate)
                const targetIsBetween  = target.isBetween(start, end)
                if (targetIsBetween == false) {
                    return false
                }
            } else {
                const start = moment(project.expectedStartDate)
                const end = moment(project.expectedEndDate)
                const target = moment(filters.startDate)
                const targetIsBetween  = target.isBetween(start, end)
                if (targetIsBetween == false) {
                    return false
                }
            }
        }
        if (filters.endDate) {
            if (project.actualStartDate && project.actualEndDate) {
                const start = moment(project.actualStartDate)
                const end = moment(project.actualEndDate)
                const target = moment(filters.endDate)
                const targetIsBetween  = target.isBetween(start, end)
                if (targetIsBetween == false) {
                    return false
                }
            } else {
                const start = moment(project.expectedStartDate)
                const end = moment(project.expectedEndDate)
                const target = moment(filters.endDate)
                const targetIsBetween  = target.isBetween(start, end)
                if (targetIsBetween == false) {
                    return false
                }
            }
        }
        return true
    })
    return filtered
}
