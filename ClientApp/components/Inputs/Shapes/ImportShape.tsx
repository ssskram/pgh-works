
// module to import a shape from an existing Cartegraph asset

import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../../store'
import * as Assets from '../../../store/GETS/taggableAssets'
import TaggableAssetSelection from './../Tag/NewTag'

export class ImportShape extends React.Component<any, any> {
    constructor() {
        super()
    }

    receiveAsset(asset) {
        this.props.passShape(asset.shape)
    }

    public render() {
        return (
            <div>
                <TaggableAssetSelection
                    parent={'shape'}
                    receiveAsset={this.receiveAsset.bind(this)} />
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.taggableAssets
    }),
    ({
        ...Assets.actionCreators
    })
)(ImportShape as any) as typeof ImportShape