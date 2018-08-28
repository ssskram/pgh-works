
import * as React from 'react'
import TaggableAssetSelection from '../TaggableAssets/Container'

export default class Tag extends React.Component<any, any> {

    receiveTag(tag) {
        // set state here
        this.props.postTag(tag)
    }

    public render() {
        return (
            <div>
                <br />
                <TaggableAssetSelection parent={'asset'} receiveTag={this.receiveTag.bind(this)} />
            </div>
        )
    }
}