import { fetch } from 'domain-task'
import { Action, Reducer } from 'redux'
import { AppThunkAction } from './'

const loadSubphases = 'loadSubphases'
const addSubphase = 'addSubphases'
const updateSubphase = 'updateSubphases'
const deleteSubphase = 'deleteSubphases'

const unloadedState: SubphaseState = {
    subphases: []
}

export interface SubphaseState {
    subphases: SubphaseItem[]
}

export interface SubphaseItem {
    cartegraphID: string
    subphaseID: string
    subphaseName: string
    phaseID: string
    projectID: string
    subphaseStatus: string
    percentComplete: number
    notes: string
    created: string
}

export const actionCreators = {
    loadSubphases: (): AppThunkAction<any> => (dispatch, getState) => {
        fetch('/api/subphases/loadSubphases', {
            credentials: 'same-origin',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
            }
        })
            .then(response => response.json())
            .then(data => {
                dispatch({ type: loadSubphases, subphases: data });
            });
    },
    addSubphase: (item): AppThunkAction<any> => (dispatch, getState) => {

        dispatch({
            type: addSubphase, item
        })
    },
    updateSubphase: (item): AppThunkAction<any> => (dispatch, getState) => {

        // put to cartegraph

        dispatch({
            type: updateSubphase, item
        })
    },
    deleteSubphase: (item): AppThunkAction<any> => (dispatch, getState) => {
        dispatch({
            type: deleteSubphase, item
        })
    }
}

export const reducer: Reducer<SubphaseState> = (state: SubphaseState, incomingAction: Action) => {
    const action = incomingAction as any;
    switch (action.type) {
        case loadSubphases:
            return {
                ...state,
                subphases: action.subphases
            };
        case addSubphase:
            return {
                ...state,
                subphases: state.subphases.concat(action.item)
            };
        case updateSubphase:
            return {
                ...state,
                subphases: state.subphases.map(subphase => subphase.subphaseID === action.item.subphaseID ? {
                    ...subphase,
                    cartegraphID: action.item.cartegraphID,
                    projectID: action.item.projectID,
                    subphaseID: action.item.subphaseID,
                    subphaseName: action.item.subphaseName,
                    startDate: action.item.startDate,
                    endDate: action.item.endDate,
                    subphaseDescription: action.item.subphaseDescription,
                    subphaseStatus: action.item.subphaseStatus,
                    percentComplete: action.item.percentComplete,
                    notes: action.item.notes,
                    created: action.item.created
                } : subphase
                )
            };
        case deleteSubphase:
            var subphasesCopy = state.subphases.slice()
            subphasesCopy.splice(subphasesCopy.indexOf(action.item), 1);
            return {
                ...state,
                subphases: subphasesCopy
            };
    }

    return state || unloadedState;
}