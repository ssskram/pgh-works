
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as AttachmentsStore from '../../store/attachments'
import Modal from 'react-responsive-modal'
import AttachmentModule from '../Inputs/Attachment'
import Table from 'react-table'

const iconStyle = {
    marginRight: '5px',
    marginTop: '-8px',
    height: '35px'
}

export class Attachments extends React.Component<any, any> {
    constructor() {
        super();
        this.state = {
            // utilities
            modalIsOpen: false,

            // attachments
            attachments: [],
        }
        this.getAttachments = this.getAttachments.bind(this);
    }

    componentDidMount() {
        this.getAttachments(this.props)
    }

    componentWillReceiveProps(nextProps) {
        this.getAttachments(this.props)
    }

    getAttachments(props) {
        if (props.attachments) {
            let attachments = props.attachments.filter(function (item) {
                return item.parentID == props.parentID
            })
            if (attachments.length > 0) {
                this.setState({
                    attachments: attachments
                })
            }
        }
    }

    closeModal() {
        this.setState({
            modalIsOpen: false
        });
    }

    openModal() {
        this.setState({
            modalIsOpen: true
        })
    }

    public render() {
        const {
            modalIsOpen,
            attachments
        } = this.state

        const {
            parentID,
            parentType
        } = this.props

        return (
            <div>
                <h3><img style={iconStyle} src='./images/attachment.png' /> Attachments<span><button onClick={this.openModal.bind(this)} className='btn pull-right hidden-xs'>Upload an attachment</button></span></h3>
                <hr />
                <div className='col-md-12'>
                    {attachments.length == 0 &&
                        <h4 className='text-center'><i>No attachments</i></h4>
                    }
                    {attachments.length > 0 &&
                        <h4 className='text-center'><i>Return attachments now</i></h4>
                    }
                </div>
                <Modal
                    open={modalIsOpen}
                    onClose={this.closeModal.bind(this)}
                    classNames={{
                        overlay: 'custom-overlay',
                        modal: 'custom-modal'
                    }}
                    center>
                    <AttachmentModule
                        parentID={parentID}
                        parentType={parentType}
                        closeModal={this.closeModal.bind(this)} />
                </Modal>
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