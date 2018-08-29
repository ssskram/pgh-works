
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Tags from '../../store/tags'

export class DeleteTag extends React.Component<any, any> {

    deleteTag () {
        this.props.deleteTag(this.props.tag)
        this.props.closeModal()
    }

    public render() {
        return (
            <div className='col-md-12 text-center'>
                <h2>Are you sure you want to delete this tag?</h2>
                <button onClick={this.deleteTag.bind(this)} className='btn btn-danger'>Delete</button>
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.tags
    }),
    ({
        ...Tags.actionCreators
    })
  )(DeleteTag as any) as typeof DeleteTag