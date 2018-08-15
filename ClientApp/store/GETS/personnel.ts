import { fetch } from 'domain-task';

const loadPersonnel = 'load'

const unloadedState: PersonnelState = {
    personnel: []
}

export interface PersonnelState {
    personnel: PersonnelItem[]
}

export interface PersonnelItem {
    email: string
    firstName: string
    lastName: string
}

export const actionCreators = {
    loadPersonnel: () => (dispatch) => {
        fetch('/api/personnel/loadPersonnel', {
            credentials: 'same-origin',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
            }
        })
            // .then(response => response.json())
            // .then(data => {
            //     dispatch({ type: loadPersonnel, personnel: data.items });
            // });
    }
}

export const reducer = (state: PersonnelState, action) => {
    switch (action.type) {
        case loadPersonnel:
            return {
                ...state,
                personnel: action.personnel
            };
    }

    return state || unloadedState;
}