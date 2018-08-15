import { fetch } from 'domain-task';

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
    loadStatuses: () => (dispatch) => {
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

export const reducer = (state: StatusState, action) => {
    switch (action.type) {
        case loadStatuses:
            return {
                ...state,
                statuses: action.statuses
            };
    }

    return state || unloadedState;
}