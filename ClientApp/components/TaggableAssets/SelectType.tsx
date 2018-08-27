
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Assets from '../../store/GETS/taggableAssets'

export class SelectAssetType extends React.Component<any, any> {

    public render() {
        return (
            <div>
                <h3>Select asset type</h3>
                <hr />
                <div className='row col-md-12'>
                    <i>Interface for searching & selecting shape-bound asset from Cartegraph</i>
                </div>
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
)(SelectAssetType as any) as typeof SelectAssetType