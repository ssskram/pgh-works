import { fetch, addTask } from 'domain-task';
import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';

const loadTags = 'load'
const add = 'add'
// TODO
const del = 'delete'

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
    loadTags: () => (dispatch) => {
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
    addTag: (item) => (dispatch) => {
        dispatch({
            type: add, item
        })
    }
}

export const reducer = (state: TagState, action) => {
    switch (action.type) {
        case loadTags:
            return {
                ...state,
                tags: action.tags
            };
        case add:
            return {
                ...state,
                tags: state.tags.concat(action.item)
            };
    }

    return state || unloadedState;
}