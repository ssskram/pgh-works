import { fetch } from 'domain-task'
import { Action, Reducer } from 'redux'
import { AppThunkAction } from './../'

const loadStatuses = 'load'

const unloadedState: StatusState = {
    statuses: []
}

export interface StatusState {
    statuses: StatusItem[]
}

export interface StatusItem {
    statusName: string
}

export const actionCreators = {
    loadStatuses: (): AppThunkAction<any> => (dispatch, getState) => {
        fetch('/api/statuses/loadStatuses', {
            credentials: 'same-origin',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
            }
        })
            // .then(response => response.json())
            // .then(data => {
            //     dispatch({ type: loadStatuses, statuses: data.items });
            // });
    }
}

export const reducer: Reducer<StatusState> = (state: StatusState, incomingAction: Action) =>  {
    const action = incomingAction as any;
    switch (action.type) {
        case loadStatuses:
            return {
                ...state,
                statuses: action.statuses
            };
    }

    return state || unloadedState;
}