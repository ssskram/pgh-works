import { fetch } from 'domain-task'
import { Action, Reducer } from 'redux'
import { AppThunkAction } from './'

const loadDrawdowns = 'loadDrawdowns'
const addDrawdown = 'addDrawdowns'
const updateDrawdown = 'updateDrawdown'
const deleteDrawdown = 'deleteDrawdown'

const unloadedState: DrawdownState = {
    drawdowns: []
}

export interface DrawdownState {
    drawdowns: DrawdownItem[]
}

export interface DrawdownItem {
    drawdownID: string
    parentID: string
    parentType: string
    fundID: string
    drawdownAmount: number
    drawdownType: string
    notes: string
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
    },
    deleteDrawdown: (item): AppThunkAction<any> => (dispatch, getState) => {
        dispatch({
            type: deleteDrawdown, item
        })
    },
    updateDrawdown: (item): AppThunkAction<any> => (dispatch, getState) => {
        dispatch({
            type: updateDrawdown, item
        })
    }
}

export const reducer: Reducer<DrawdownState> = (state: DrawdownState, incomingAction: Action) => {
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
        case updateDrawdown:
            return {
                ...state,
                drawdowns: state.drawdowns.map(drawdown => drawdown.drawdownID === action.item.drawdownID ? {
                    ...drawdown,
                    drawdownID: action.item.drawdownID,
                    parentID: action.item.parentID,
                    parentType: action.item.parentType,
                    fundID: action.item.fundID,
                    drawdownAmount: action.item.drawdownAmount,
                    drawdownType: action.item.drawdownType,
                    notes: action.item.notes
                } : drawdown
                )
            }
        case deleteDrawdown:
            var drawdownCopy = state.drawdowns.slice()
            drawdownCopy.splice(drawdownCopy.indexOf(action.item), 1);
            return {
                ...state,
                drawdowns: drawdownCopy
            };
    }

    return state || unloadedState;
}