
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Subphases from '../../store/subphases'

export class DeleteSubphase extends React.Component<any, any> {

    deleteSubphase () {
        // remove from store
        this.props.deleteSubphase(this.props.subphase)
        // then delete locally
        this.props.removeSubphase(this.props.subphase)
        this.props.closeModal()
    }

    public render() {
        return (
            <div className='col-md-12 text-center'>
                <h2>Are you sure you want to delete this subphase?</h2>
                <button onClick={this.deleteSubphase.bind(this)} className='btn btn-danger'>Delete</button>
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.subphases
    }),
    ({
        ...Subphases.actionCreators
    })
  )(DeleteSubphase as any) as typeof DeleteSubphase