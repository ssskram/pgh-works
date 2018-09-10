import { fetch } from 'domain-task'
import { Action, Reducer } from 'redux'
import { AppThunkAction } from './'

const loadDrawdowns = 'loadDrawdowns'
const addDrawdown = 'addDrawdowns'

// TODO
const del = 'deleteDrawdowns'

const unloadedState: DrawdownState = {
    drawdowns: []
}

export interface DrawdownState {
    drawdowns: DrawdownItem[]
}

export interface DrawdownItem {
    parentID: string
    parentType: string
    fundID: string
    drawdownAmount: string
    drawdownType: string
    contractorVendor: string
}

export const actionCreators = {
    loadDrawdowns: (): AppThunkAction<any> => (dispatch, getState) => {
        fetch('/api/drawdowns/loadDrawdowns', {
            credentials: 'same-origin',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
            }
        })
            // .then(response => response.json())
            // .then(data => {
            //     dispatch({ type: loadDrawdowns, drawdowns: data.items });
            // });
    },
    addDrawdown: (item): AppThunkAction<any> => (dispatch, getState) => {
        dispatch({
            type: addDrawdown, item
        })
    }
}

export const reducer: Reducer<DrawdownState> = (state: DrawdownState, incomingAction: Action) =>  {
    const action = incomingAction as any;
    switch (action.type) {
        case loadDrawdowns:
            return {
                ...state,
                drawdowns: action.drawdowns
            };
        case addDrawdown:
            return {
                ...state,
                drawdowns: state.drawdowns.concat(action.item)
            };
    }

    return state || unloadedState;
}