import { fetch } from 'domain-task'
import { Action, Reducer } from 'redux'
import { AppThunkAction } from './../'

const loadAssets = 'load'

const unloadedState: AssetState = {
    assets: []
}

export interface AssetState {
    assets: AssetItem[]
}

export interface AssetItem {
    assetOID: string
    assetName: string
    assetType: string
    shape: Coords[]
}

export interface Coords {
    Points: Points[]
}

export interface Points {
    lat: number
    lng: number
}

export const actionCreators = {
    loadTaggableAssets: (): AppThunkAction<any> => (dispatch, getState) => {
        fetch('/api/assets/loadTaggableAssets', {
            credentials: 'same-origin',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
            }
        })
            .then(response => response.json())
            .then(data => {
                dispatch({ type: loadAssets, assets: data });
            });
    }
}

export const reducer: Reducer<AssetState> = (state: AssetState, incomingAction: Action) =>  {
    const action = incomingAction as any;
    switch (action.type) {
        case loadAssets:
            return {
                ...state,
                assets: action.assets
            };
    }

    return state || unloadedState;
}