
import * as React from 'react'
import TaggableAssetSelection from '../TaggableAssets/Container'

export default class Tag extends React.Component<any, any> {

    receiveAsset(asset) {
        this.props.postTag(asset)
    }

    public render() {
        return (
            <div>
                <br/>
                <TaggableAssetSelection parent={'asset'} receiveAsset={this.receiveAsset.bind(this)} />
            </div>
        )
    }
}