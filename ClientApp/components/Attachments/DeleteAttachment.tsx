
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Attachments from '../../store/attachments'

export class DeleteAttachment extends React.Component<any, any> {

    deleteAttachment () {
        // remove from store
        this.props.deleteAttachment(this.props.attachment)
        // then delete locally
        this.props.removeAttachment(this.props.attachment)
        this.props.closeModal()
    }

    public render() {
        return (
            <div className='col-md-12 text-center'>
                <h2>Are you sure you want to delete this attachment?</h2>
                <button onClick={this.deleteAttachment.bind(this)} className='btn btn-danger'>Delete</button>
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.attachments
    }),
    ({
        ...Attachments.actionCreators
    })
  )(DeleteAttachment as any) as typeof DeleteAttachment