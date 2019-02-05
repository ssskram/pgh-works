
// module to import a shape from an existing Cartegraph asset

import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../../store'
import * as Assets from '../../../store/GETS/taggableAssets'
import TaggableAssetSelection from './../Tag/NewTag'
import Spinner from '../../Utilities/Spinner'

export class ImportShape extends React.Component<any, any> {
    constructor(props) {
        super(props)
    }

    receiveAsset(asset) {
        this.props.passShape(asset.shape)
    }

    public render() {
        return (
            <div>
                {this.props.assets &&
                    <TaggableAssetSelection
                        parent={'shape'}
                        receiveAsset={this.receiveAsset.bind(this)} />
                }
                {!this.props.assets &&
                    <Spinner notice='...loading the assets...' />
                }
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