import { fetch } from 'domain-task'
import { Action, Reducer } from 'redux'
import { AppThunkAction } from './'

const loadMilestones = 'loadMilestones'
const addMilestone = 'addMilestones'
const updateMilestone = 'updateMilestones'
const deleteMilestone = 'deleteMilestones'

const unloadedState: MilestoneState = {
    milestones: []
}

export interface MilestoneState {
    milestones: MilestoneItem[]
}

export interface MilestoneItem {
    cartegraphID: string
    milestoneID: string
    milestoneName: string
    phaseID: string
    projectID: string
    dueDate: string
    percentComplete: number
    dateCompleted: string
    notes: string
}

export const actionCreators = {
    loadMilestones: (): AppThunkAction<any> => (dispatch, getState) => {
        fetch('/api/milestones/loadMilestones', {
            credentials: 'same-origin',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
            }
        })
            .then(response => response.json())
            .then(data => {
                dispatch({ type: loadMilestones, milestones: data });
            });
    },
    addMilestone: (item): AppThunkAction<any> => (dispatch, getState) => {

        dispatch({
            type: addMilestone, item
        })
    },
    updateMilestone: (item): AppThunkAction<any> => (dispatch, getState) => {

        // put to cartegraph

        dispatch({
            type: updateMilestone, item
        })
    },
    deleteMilestone: (item): AppThunkAction<any> => (dispatch, getState) => {
        dispatch({
            type: deleteMilestone, item
        })
    }
}

export const reducer: Reducer<MilestoneState> = (state: MilestoneState, incomingAction: Action) => {
    const action = incomingAction as any;
    switch (action.type) {
        case loadMilestones:
            return {
                ...state,
                milestones: action.milestones
            };
        case addMilestone:
            return {
                ...state,
                milestones: state.milestones.concat(action.item)
            };
        case updateMilestone:
            return {
                ...state,
                milestones: state.milestones.map(milestone => milestone.milestoneID === action.item.milestoneID ? {
                    ...milestone,
                    cartegraphID: action.item.cartegraphID,
                    projectID: action.item.projectID,
                    milestoneID: action.item.milestoneID,
                    phaseID: action.item.phaseID,
                    milestoneName: action.item.milestoneName,
                    dueDate: action.item.dueDate,
                    dateCompleted: action.item.dateCompleted,
                    percentComplete: action.item.percentComplete,
                    notes: action.item.notes
                } : milestone
                )
            };
        case deleteMilestone:
            var milestonesCopy = state.milestones.slice()
            milestonesCopy.splice(milestonesCopy.indexOf(action.item), 1);
            return {
                ...state,
                milestones: milestonesCopy
            };
    }

    return state || unloadedState;
}