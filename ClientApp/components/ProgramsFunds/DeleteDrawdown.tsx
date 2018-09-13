
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Drawdowns from '../../store/drawdowns'

export class DeleteDrawdown extends React.Component<any, any> {

    deleteDrawdown () {
        const drawdown = this.props.drawdown
        console.log(drawdown)
        // remove from store
        this.props.deleteDrawdown(drawdown)
        // then delete locally
        this.props.removeDrawdown(drawdown)
        if (this.props.drawdown) {

        }
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