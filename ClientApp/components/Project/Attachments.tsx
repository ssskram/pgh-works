
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as AttachmentsStore from '../../store/attachments'

export class Attachments extends React.Component<any, any> {

    public render() {
        const {
            projectID
        } = this.props
        return (
            <div>
                <h3>Attachments<span><button className='btn pull-right hidden-xs'>Upload an attachment</button></span></h3>
                <hr />
                <h5>Return attachments added to project {projectID}</h5>
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.attachments
    }),
    ({
        ...AttachmentsStore.actionCreators
    })
  )(Attachments as any) as typeof Attachments