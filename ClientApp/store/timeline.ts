import { Action, Reducer } from 'redux'
import { AppThunkAction } from './'

const addTimeline = 'addTimeline'
const deleteTimeline = 'deleteTimeline'

const unloadedState: TimelineState = {
    timeline: []
}

export interface TimelineState {
    timeline: TimelineItem[]
}

export interface TimelineItem {
    id: string
    parentProjectID: string
    type: string
    name: string
    expectedStartDate: string
    expectedEndDate: string
    actualStartDate: string
    actualEndDate: string
}

export const actionCreators = {
    addTimeline: (item): AppThunkAction<any> => (dispatch, getState) => {
        let match = getState().timeline.timeline.filter(function (timeline) {
            return timeline.id == item.id
        })
        if (match.length == 0) {
            dispatch({
                type: addTimeline, item
            })
        }
    },

    deleteTimeline: (projectID): AppThunkAction<any> => (dispatch, getState) => {
        let itemsToDelete = getState().timeline.timeline.filter(function (timeline) {
            return timeline.id == projectID || timeline.parentProjectID == projectID
        })
        itemsToDelete.forEach (function (timelineItem) {
            dispatch({
                type: deleteTimeline, timelineItem
            })
        })
    }
}

export const reducer: Reducer<TimelineState> = (state: TimelineState, incomingAction: Action) => {
    const action = incomingAction as any;
    switch (action.type) {
        case addTimeline:
            return {
                ...state,
                timeline: state.timeline.concat(action.item)
            };
        case deleteTimeline:
            var timelineCopy = state.timeline.slice()
            timelineCopy.splice(timelineCopy.indexOf(action.item), 1);
            return {
                ...state,
                timeline: timelineCopy
            };
    }

    return state || unloadedState;
}