
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Assets from '../../store/GETS/taggableAssets'

export class SelectAsset extends React.Component<any, any> {

    public render() {
        return (
            <div>
                <h3>Select Asset</h3>
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
)(SelectAsset as any) as typeof SelectAsset