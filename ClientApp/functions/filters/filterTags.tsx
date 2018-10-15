
// tag filter

import * as moment from 'moment'

export default function filterTags(tags, projects, phases, filters) {
    const filtered = tags.filter(tag => {
        let parent = {} as any
        if (tag.parentType == 'Project') {
            parent = projects.find(project => {
                return tag.parentID == project.projectID
            })
        } else { // parent == phase 
            parent = phases.find(phase => {
                return tag.parentID == phase.phaseID
            })
        }
        if (filters.parentType) {
            if (!tag.parentType.includes(filters.parentType)) {
                return false
            }
        }
        if (filters.startDate || filters.endDate) {
            if (parent.actualStartDate && parent.actualEndDate) {
                let startIsBetweeon = false
                let endIsBetween = false
                if (filters.startDate) {
                    const start = moment(parent.actualStartDate)
                    const end = moment(parent.actualEndDate)
                    const target = moment(filters.startDate)
                    startIsBetweeon  = target.isBetween(start, end)
                }
                if (filters.endDate) {
                    const start = moment(parent.actualStartDate)
                    const end = moment(parent.actualEndDate)
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
                    const start = moment(parent.expectedStartDate)
                    const end = moment(parent.actualStartDate)
                    const target = moment(filters.startDate)
                    startIsBetweeon = target.isBetween(start, end)
                }
                if (filters.endDate) {
                    const start = moment(parent.expectedStartDate)
                    const end = moment(parent.expectedEndDate)
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