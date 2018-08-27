import { fetch } from 'domain-task'
import { Action, Reducer } from 'redux'
import { AppThunkAction } from './'

const loadMilestones = 'loadMilestones'
const addMilestone = 'addMilestones'

// TODO
const update = 'updateMilestones'
const del = 'deleteMilestones'

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
        
        dispatch({
            type: addMilestone, item
        })
    },
}

export const reducer: Reducer<MilestoneState> = (state: MilestoneState, incomingAction: Action) =>  {
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
    }

    return state || unloadedState;
}