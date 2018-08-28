
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Assets from '../../store/GETS/taggableAssets'
import SelectType from '../TaggableAssets/SelectType'
import SelectAsset from '../TaggableAssets/SelectAsset'
import DescribeTag from './TagDescription'

export class TaggableAssetSelection extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            parentComponent: props.parent,
            assetType: '',

            // for tag generation
            selectedAsset: {},
            tagDescription: false
        }
    }

    back() {
        if (this.state.tagDescription == false) {
            this.setState({
                assetType: ''
            })
        } else {
            this.setState ({
                tagDescription: false,
                selectedAsset: {}
            })
        }
    }

    receiveType(type) {
        this.setState({
            assetType: type
        })
    }

    receiveAsset (asset) {
        if (this.state.parentComponent == 'asset') {
            this.setState({
                tagDescription: true,
                selectedAsset: asset
            })
        } else {
            this.props.receiveAsset(asset)
        }
    }

    receiveDescription (tag) {
        this.props.receiveTag(tag)
    }

    public render() {
        const {
            parentComponent,
            assetType,
            tagDescription,
            selectedAsset
        } = this.state

        return (
            <div>
                {assetType == '' &&
                    <SelectType
                        parentComponent={parentComponent}
                        receiveType={this.receiveType.bind(this)} />
                }
                {assetType != '' && Object.keys(selectedAsset).length == 0 &&
                    <SelectAsset
                        assetType={assetType}
                        receiveAsset={this.receiveAsset.bind(this)}
                        back={this.back.bind(this)} />
                }
                {tagDescription == true &&
                    <DescribeTag
                        asset={selectedAsset}
                        receiveDescription={this.receiveDescription.bind(this)}
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