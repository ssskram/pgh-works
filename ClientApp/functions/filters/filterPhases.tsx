
// phase filter

import * as moment from 'moment'

export default function filterPhases (phases, projects, filters) {
    let projectID = ''
    if (filters.projectName) {
        const project = projects.find(project => {
            return project.projectName == filters.projectName
        })
        projectID = project.projectID
    }
    const filtered = phases.filter(phase => {
        if (filters.phaseName) {
            if (!phase.phaseName.includes(filters.phaseName)) {
                return false
            }
        }
        if (filters.phaseStatus) {
            if (!phase.phaseStatus.includes(filters.phaseStatus)) {
                return false
            }
        }
        if (filters.startDate || filters.endDate) {
            if (phase.actualStartDate && phase.actualEndDate) {
                let startIsBetweeon = false
                let endIsBetween = false
                if (filters.startDate) {
                    const start = moment(phase.actualStartDate)
                    const end = moment(phase.actualEndDate)
                    const target = moment(filters.startDate)
                    startIsBetweeon  = target.isBetween(start, end)
                }
                if (filters.endDate) {
                    const start = moment(phase.actualStartDate)
                    const end = moment(phase.actualEndDate)
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
                    const start = moment(phase.expectedStartDate)
                    const end = moment(phase.actualStartDate)
                    const target = moment(filters.startDate)
                    startIsBetweeon = target.isBetween(start, end)
                }
                if (filters.endDate) {
                    const start = moment(phase.expectedStartDate)
                    const end = moment(phase.expectedEndDate)
                    const target = moment(filters.endDate)
                    endIsBetween = target.isBetween(start, end)
                }
                if (startIsBetweeon == false && endIsBetween == false) {
                    return false
                }
            }
        }
        if (projectID != '') {
            if (!phase.projectID.includes(projectID)) {
                return false
            }
        }
        return true
    })
    return filtered
}