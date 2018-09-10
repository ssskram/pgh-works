import { fetch } from 'domain-task'
import { Action, Reducer } from 'redux'
import { AppThunkAction } from './../'

const loadFunds = 'loadFunds'

const unloadedState: FundState = {
    funds: []
}

export interface FundState {
    funds: FundItem[]
}

export interface FundItem {
    fundID: string
    fundName: string
    fundYear: string
    fundType: string
    expirationDate: string
    fundAmount: string
}

export const actionCreators = {
    loadFunds: (): AppThunkAction<any> => (dispatch, getState) => {
        fetch('/api/funds/loadFunds', {
            credentials: 'same-origin',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
            }
        })
            .then(response => response.json())
            .then(data => {
                dispatch({ type: loadFunds, funds: data });
            });
    }
}

export const reducer: Reducer<FundState> = (state: FundState, incomingAction: Action) =>  {
    const action = incomingAction as any;
    switch (action.type) {
        case loadFunds:
            return {
                ...state,
                funds: action.funds
            };
    }

    return state || unloadedState;
}