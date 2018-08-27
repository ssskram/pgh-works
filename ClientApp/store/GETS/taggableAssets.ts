import { fetch } from 'domain-task';

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
    lat: string
    lng: string
}

export const actionCreators = {
    loadTaggableAssets: () => (dispatch) => {
        fetch('/api/assets/loadTaggableAssets', {
            credentials: 'same-origin',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
            }
        })
            .then(response => response.json())
            .then(data => {
                dispatch({ type: loadAssets, assets: data });
                console.log (data)
            });
    }
}

export const reducer = (state: AssetState, action) => {
    switch (action.type) {
        case loadAssets:
            return {
                ...state,
                assets: action.assets
            };
    }

    return state || unloadedState;
}