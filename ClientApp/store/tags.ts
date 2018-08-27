import { fetch } from 'domain-task'
import { Action, Reducer } from 'redux'
import { AppThunkAction } from './'

const loadTags = 'loadTags'
const addTag = 'addTags'

// TODO
const del = 'deleteTags'

const unloadedState: TagState = {
    tags: []
}

export interface TagState {
    tags: TagItem[]
}

export interface TagItem {
    projectID: string    
    taggedAssetOID: string
    dateCreated: string
    tagType: string
    tagDescription: string
}

export const actionCreators = {
    loadTags: (): AppThunkAction<any> => (dispatch, getState) => {
        fetch('/api/tags/loadTags', {
            credentials: 'same-origin',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
            }
        })
        //     .then(response => response.json())
        //     .then(data => {
        //         dispatch({ type: loadTags, tags: data.items });
        //     });
    },
    addTag: (item): AppThunkAction<any> => (dispatch, getState) => {
        dispatch({
            type: addTag, item
        })
    }
}

export const reducer: Reducer<TagState> = (state: TagState, incomingAction: Action) =>  {
    const action = incomingAction as any;
    switch (action.type) {
        case loadTags:
            return {
                ...state,
                tags: action.tags
            };
        case addTag:
            return {
                ...state,
                tags: state.tags.concat(action.item)
            };
    }

    return state || unloadedState;
}