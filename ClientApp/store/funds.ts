import { fetch } from 'domain-task';

const loadFunds = 'load'
const add = 'add'
// TODO
const update = 'update'

const unloadedState: FundState = {
    funds: []
}

export interface FundState {
    funds: FundItem[]
}

export interface FundItem {
    categraphID: string
    fundID: string
    fundName: string
    fundYear: string
    fundOriginalAmount: string
    fundCurrentAmount: string
}

export const actionCreators = {
    loadFunds: () => (dispatch) => {
        fetch('/api/funds/loadFunds', {
            credentials: 'same-origin',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
            }
        })
        //     .then(response => response.json())
        //     .then(data => {
        //         dispatch({ type: loadFunds, funds: data.items });
        //     });
    },
    addFund: (item) => (dispatch) => {
        dispatch({
            type: add, item
        })
    },
}

export const reducer = (state: FundState, action) => {
    switch (action.type) {
        case loadFunds:
            return {
                ...state,
                funds: action.funds
            };
        case add:
            return {
                ...state,
                funds: state.funds.concat(action.item)
            };
    }

    return state || unloadedState;
}