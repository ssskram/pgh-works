
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../../store'
import * as Assets from '../../../store/GETS/taggableAssets'
import SelectType from './../../TaggableAssets/SelectType'
import SelectAsset from './../../TaggableAssets/SelectAsset'

export class ImportShape extends React.Component<any, any> {
    constructor() {
        super();
        this.state = {
            assetType: '',
            selectedAsset: {}
        }
    }

    public render() {
        const {
            assetType,
            selectedAsset
        } = this.state

        return (
            <div>
                {assetType == '' &&
                    <SelectType />
                }
                {assetType != '' &&
                    <SelectAsset />
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