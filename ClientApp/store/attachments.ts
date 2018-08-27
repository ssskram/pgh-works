import { fetch } from 'domain-task'
import { Action, Reducer } from 'redux'
import { AppThunkAction } from './'

const loadAttachments = 'load'
const add = 'add'

// TODO
const del = 'delete'

const unloadedState: AttachmentState = {
    attachments: []
}

export interface AttachmentState {
    attachments: AttachmentItem[]
}

export interface AttachmentItem {
    projectID: string    
    attachmentID: string
    dateCreated: string
    attachmentName: string
    attachmentDescription: string
    attachmentLink: string
}

export const actionCreators = {
    loadAttachments: (): AppThunkAction<any> => (dispatch, getState) => {
        fetch('/api/attachments/loadAttachments', {
            credentials: 'same-origin',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
            }
        })
            // .then(response => response.json())
            // .then(data => {
            //     dispatch({ type: loadAttachments, attachments: data.items });
            // });
    },
    addAttachment: (item): AppThunkAction<any> => (dispatch, getState) => {
        dispatch({
            type: add, item
        })
    }
}

export const reducer: Reducer<AttachmentState> = (state: AttachmentState, incomingAction: Action) =>  {
    const action = incomingAction as any;
    switch (action.type) {
        case loadAttachments:
            return {
                ...state,
                attachments: action.attachments
            };
        case add:
            return {
                ...state,
                attachments: state.attachments.concat(action.item)
            };
    }

    return state || unloadedState;
}