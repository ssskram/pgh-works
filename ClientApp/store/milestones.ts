import { fetch, addTask } from 'domain-task';
import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';

const loadMilestones = 'load'
const add = 'add'

// TODO
const update = 'update'
const del = 'del'

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
    loadMilestones: () => (dispatch) => {
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
    addMilestone: (item) => (dispatch) => {
        dispatch({
            type: add, item
        })
    },
}

export const reducer = (state: MilestoneState, action) => {
    switch (action.type) {
        case loadMilestones:
            return {
                ...state,
                milestones: action.milestones
            };
        case add:
            return {
                ...state,
                milestones: state.milestones.concat(action.item)
            };
    }

    return state || unloadedState;
}