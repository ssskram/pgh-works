import { fetch } from 'domain-task'
import { Action, Reducer } from 'redux'
import { AppThunkAction } from './'

const loadActivity = 'loadActivity'
const addActivity = 'addActivity'
const updateActivity = 'updateActivity'
const deleteActivity = 'deleteActivity'

const unloadedState: ActivityState = {
    activity: []
}

export interface ActivityState {
    activity: ActivityItem[]
}

export interface ActivityItem {
    cartegraphID: string
    activityID: string
    activityName: string
    phaseID: string
    projectID: string
    dueDate: string
    percentComplete: number
    dateCompleted: string
    notes: string
}

export const actionCreators = {
    loadActivity: (): AppThunkAction<any> => (dispatch, getState) => {
        fetch('/api/activity/loadActivity', {
            credentials: 'same-origin',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
            }
        })
            .then(response => response.json() as Promise<ActivityItem[]>)
            .then(data => {
                dispatch({ type: loadActivity, activity: data });
            });
    },
    addActivity: (item): AppThunkAction<any> => (dispatch, getState) => {
        let data = JSON.stringify(item).replace(/'/g, '')
        fetch('/api/activity/addActivity', {
            method: 'POST',
            body: data,
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        dispatch({
            type: addActivity, item
        })
    },
    updateActivity: (item): AppThunkAction<any> => (dispatch, getState) => {
        let data = JSON.stringify(item).replace(/'/g, '')
        fetch('/api/activity/updateActivity', {
            method: 'PUT',
            body: data,
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        dispatch({
            type: updateActivity, item
        })
    },
    deleteActivity: (item): AppThunkAction<any> => (dispatch, getState) => {
        let data = JSON.stringify(item).replace(/'/g, '')
        fetch('/api/activity/deleteActivity', {
            method: 'DELETE',
            body: data,
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        dispatch({
            type: deleteActivity, item
        })
    }
}

export const reducer: Reducer<ActivityState> = (state: ActivityState, incomingAction: Action) => {
    const action = incomingAction as any;
    switch (action.type) {
        case loadActivity:
            return {
                ...state,
                activity: action.activity
            };
        case addActivity:
            return {
                ...state,
                activity: state.activity.concat(action.item)
            };
        case updateActivity:
            return {
                ...state,
                activity: state.activity.map(activity => activity.activityID === action.item.activityID ? {
                    ...activity,
                    cartegraphID: action.item.cartegraphID,
                    projectID: action.item.projectID,
                    activityID: action.item.activityID,
                    phaseID: action.item.phaseID,
                    activityName: action.item.activityName,
                    dueDate: action.item.dueDate,
                    dateCompleted: action.item.dateCompleted,
                    percentComplete: action.item.percentComplete,
                    notes: action.item.notes
                } : activity
                )
            };
        case deleteActivity:
            let activityCopy = state.activity.slice()
            activityCopy.splice(activityCopy.indexOf(action.item), 1);
            return {
                ...state,
                activity: activityCopy
            };
    }

    return state || unloadedState;
}