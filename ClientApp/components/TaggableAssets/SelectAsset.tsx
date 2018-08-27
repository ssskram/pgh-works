
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Assets from '../../store/GETS/taggableAssets'

export class SelectAsset extends React.Component<any, any> {

    public render() {
        return (
            <div>
                <h3>Select {this.props.assetType}</h3>
                <hr />
                <div className='row'>
                    <i>dropdown here</i>
                    <div className='col-md-12 text-center'>
                        <button onClick={this.props.back} className='btn btn-warning'>Back</button>
                    </div>
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