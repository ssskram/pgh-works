
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Assets from '../../store/GETS/taggableAssets'
import SelectType from '../TaggableAssets/SelectType'
import SelectAsset from '../TaggableAssets/SelectAsset'

export class TaggableAssetSelection extends React.Component<any, any> {
    constructor() {
        super();
        this.state = {
            assetType: '',
        }
    }

    back() {
        this.setState({
            assetType: ''
        })
    }

    receiveType(type) {
        this.setState({
            assetType: type
        })
    }

    receiveAsset(asset) {
        this.props.receiveAsset(asset)
    }

    public render() {
        const {
            assetType,
        } = this.state

        return (
            <div>
                {assetType == '' &&
                    <SelectType receiveType={this.receiveType.bind(this)} />
                }
                {assetType != '' &&
                    <SelectAsset
                        assetType={assetType}
                        receiveAsset={this.receiveAsset.bind(this)}
                        back={this.back.bind(this)} />
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
)(TaggableAssetSelection as any) as typeof TaggableAssetSelection