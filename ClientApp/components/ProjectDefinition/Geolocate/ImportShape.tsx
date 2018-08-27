
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../../store'
import * as Assets from '../../../store/GETS/taggableAssets'

export class ImportShape extends React.Component<any, any> {

    componentDidMount() {
        // get taggable assets here and provide CgShape as importable object
        console.log(this.props.assets)
    }

    public render() {
        return (
            <div>
                <h3>Import shape</h3>
                <hr/>
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
  )(ImportShape as any) as typeof ImportShape