import { fetch } from 'domain-task'
import { Action, Reducer } from 'redux'
import { AppThunkAction } from './'

const loadMilestones = 'loadMilestones'
const addMilestone = 'addMilestones'
const updateMilestone = 'updateMilestones'

// TODO
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
    milestoneStatus: string
    percentComplete: string
    notes: string
    created: string
    createdBy: string
    lastModifiedBy: string
}

export const actionCreators = {
    loadMilestones: (): AppThunkAction<any> => (dispatch, getState) => {
        fetch('/api/milestones/loadMilestones', {
            credentials: 'same-origin',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
            }
        })
        //     .then(response => response.json())
        //     .then(data => {
        //         dispatch({ type: loadMilestones, milestones: data.items });
        //     });
    },
    addMilestone: (item): AppThunkAction<any> => (dispatch, getState) => {

        console.log(item)
        dispatch({
            type: addMilestone, item
        })
    },
    updateMilestone: (item): AppThunkAction<any> => (dispatch, getState) => {

        // put to cartegraph

        dispatch({
            type: updateMilestone, item
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
                    milestoneName: action.item.milestoneName,
                    startDate: action.item.startDate,
                    endDate: action.item.endDate,
                    milestoneDescription: action.item.milestoneDescription,
                    milestoneStatus: action.item.milestoneStatus,
                    percentComplete: action.item.percentComplete,
                    notes: action.item.notes,
                    created: action.item.created,
                    createdBy: action.item.createdBy,
                    lastModifiedBy: action.item.lastModifiedBy
                } : milestone
                )
            };
    }

    return state || unloadedState;
}