import * as moment from 'moment'

export default function filterProjects(projects, filters) {
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
        if (filters.startDate || filters.endDate) {
            if (project.actualStartDate && project.actualEndDate) {
                let startIsBetweeon = false
                let endIsBetween = false
                if (filters.startDate) {
                    const start = moment(project.actualStartDate)
                    const end = moment(project.actualEndDate)
                    const target = moment(filters.startDate)
                    startIsBetweeon  = target.isBetween(start, end)
                }
                if (filters.endDate) {
                    const start = moment(project.actualStartDate)
                    const end = moment(project.actualEndDate)
                    const target = moment(filters.endDate)
                    endIsBetween  = target.isBetween(start, end)
                }
                if (startIsBetweeon == false && endIsBetween == false) {
                    return false
                }
            } else {
                let startIsBetweeon = false
                let endIsBetween = false
                if (filters.startDate) {
                    const start = moment(project.expectedStartDate)
                    const end = moment(project.actualStartDate)
                    const target = moment(filters.startDate)
                    startIsBetweeon = target.isBetween(start, end)
                }
                if (filters.endDate) {
                    const start = moment(project.expectedStartDate)
                    const end = moment(project.expectedEndDate)
                    const target = moment(filters.endDate)
                    endIsBetween = target.isBetween(start, end)
                }
                if (startIsBetweeon == false && endIsBetween == false) {
                    return false
                }
            }
        }
        return true
    })
    return filtered
}
