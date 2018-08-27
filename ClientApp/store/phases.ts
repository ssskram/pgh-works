import { fetch } from 'domain-task'
import { Action, Reducer } from 'redux'
import { AppThunkAction } from './'

const loadPhases = 'load'
const add = 'add'

// TODO
const update = 'update'
const del = 'delete'

const unloadedState: PhaseState = {
    phases: []
}

export interface PhaseState {
    phases: PhaseItem[]
}

export interface PhaseItem {
    cartegraphID: string
    phaseID: string
    projectID: string
    phaseName: string
    phaseDescription: string
    startDate: string
    endDate: string
    phaseStatus: string
    percentComplete: string
    notes: string
    created: string
    createdBy: string
    lastModifiedBy: string
}

export const actionCreators = {
    loadPhases: (): AppThunkAction<any> => (dispatch, getState) => {
        fetch('/api/phases/loadPhases', {
            credentials: 'same-origin',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
            }
        })
            .then(response => response.json())
            .then(data => {
                dispatch({ type: loadPhases, phases: data.items });
            });
    },
    addPhase: (item): AppThunkAction<any> => (dispatch, getState) =>  {
        dispatch({
            type: add, item
        })
    },
}

export const reducer: Reducer<PhaseState> = (state: PhaseState, incomingAction: Action) =>  {
    const action = incomingAction as any;
    switch (action.type) {
        case loadPhases:
            return {
                ...state,
                phases: action.phases
            };
        case add:
            return {
                ...state,
                phases: state.phases.concat(action.item)
            };
    }

    return state || unloadedState;
}