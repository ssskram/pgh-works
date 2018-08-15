import { fetch } from 'domain-task';

const loadDrawdowns = 'load'
const add = 'add'
// TODO
const del = 'delete'

const unloadedState: DrawdownState = {
    drawdowns: []
}

export interface DrawdownState {
    drawdowns: DrawdownItem[]
}

export interface DrawdownItem {
    projectID: string
    fundID: string
    drawdownName: string
    drawdownYear: string
    drawdownAmount: string
}

export const actionCreators = {
    loadDrawdowns: () => (dispatch) => {
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
    addDrawdown: (item) => (dispatch) => {
        dispatch({
            type: add, item
        })
    }
}

export const reducer = (state: DrawdownState, action) => {
    switch (action.type) {
        case loadDrawdowns:
            return {
                ...state,
                drawdowns: action.drawdowns
            };
        case add:
            return {
                ...state,
                drawdowns: state.drawdowns.concat(action.item)
            };
    }

    return state || unloadedState;
}