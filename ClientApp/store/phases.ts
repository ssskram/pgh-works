import { fetch } from 'domain-task';

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
    loadPhases: () => (dispatch) => {
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
    addPhase: (item) => (dispatch) => {
        dispatch({
            type: add, item
        })
    },
}

export const reducer = (state: PhaseState, action) => {
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