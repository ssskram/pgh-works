
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Drawdowns from '../../store/drawdowns'

export class DeleteDrawdown extends React.Component<any, any> {

    deleteDrawdown () {
        // remove from store
        this.props.deleteDrawdown(this.props.drawdown)
        // then delete locally
        this.props.removeDrawdown(this.props.drawdown)
        this.props.closeModal()
    }

    public render() {
        return (
            <div className='col-md-12 text-center'>
                <h2>Are you sure you want to delete this drawdown?</h2>
                <button onClick={this.deleteDrawdown.bind(this)} className='btn btn-danger'>Delete</button>
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.drawdowns
    }),
    ({
        ...Drawdowns.actionCreators
    })
  )(DeleteDrawdown as any) as typeof DeleteDrawdown