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
        dispatch({
            type: deleteTimeline, projectID
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
            let timelineCopy = state.timeline.slice()
            state.timeline.forEach(function (timeline) {
                if (timeline.id == action.projectID || timeline.parentProjectID == action.projectID) {
                    timelineCopy.splice(timelineCopy.indexOf(timeline), 1);
                }
            })
            return {
                ...state,
                timeline: timelineCopy
            };
    }

    return state || unloadedState;
}